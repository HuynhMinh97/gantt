import { COLLECTIONS, JwtDto, KEYS } from '@ait/shared';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Database } from 'arangojs';
import { DB_CONNECTION_TOKEN } from '@ait/shared';
import { AuthHelper } from '../utils/ait-auth.helper';
import { AitUtils } from '../utils/ait-utils';
import { AuthLoginInput } from '../dtos/auth-login.dto';
import { AuthRegisterInput } from '../dtos/auth-register.dto';
import { AitBaseService } from './ait-base.service';
import {
  AuthCheckPasswordInput,
  AuthPasswordChanged,
  AuthPasswordChangedOutput,
} from '../dtos/auth-change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CONNECTION_TOKEN) private readonly db: Database,
    private readonly jwt: JwtService,
    private readonly aitGraphQLService: AitBaseService
  ) {}

  public async login(input: AuthLoginInput): Promise<any> {
    let user = null;
    const found = await this.findUserByEmail(input.email);

    user = found;
    if (!found) {
      const foundByUsername = await this.findUserByUserName(input.email);
      user = foundByUsername;
      if (!foundByUsername) {
        throw new NotFoundException(
          `User with email ${input.email} does not exist`
        );
      }
    }

    const passwordValid = await AuthHelper.validate(
      user.password,
      input.password
    );

    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    return await this.signToken(user._key);
  }

  public setPasswordEncrypt(password: string) {
    return AuthHelper.setEncrypt(password);
  }

  public async register(input: AuthRegisterInput) {
    const found = await this.findUserByEmail(input.email);

    if (found) {
      throw new BadRequestException(
        `Cannot register with email ${input.email}`
      );
    }
    input.password = await AuthHelper.hash(input.password);
    const created = await this.createUser({ ...input });

    return await this.signToken(created._key);
  }

  private async createUser(data: AuthRegisterInput) {
    data[KEYS.KEY] = AitUtils.guid;
    data[KEYS.CREATE_BY] = KEYS.ADMIN;
    data[KEYS.CHANGE_BY] = KEYS.ADMIN;
    data[KEYS.CHANGE_AT] = AitUtils.getUnixTime();
    data[KEYS.CREATE_AT] = AitUtils.getUnixTime();

    const aqlStr = `INSERT ${JSON.stringify(data)} INTO ${COLLECTIONS.USER}
                    LET inserted = NEW
                    RETURN inserted`;
    try {
      const res = await this.db.query(aqlStr);
      const rawData = [];
      for await (const data of res) {
        rawData.push(data);
      }
      return rawData[0] as AuthRegisterInput;
    } catch (error) {
      Logger.error(error);
      throw new Error('Cannot create data in sys_user');
    }
  }

  public async handleChangePassword(
    request: AuthPasswordChanged
  ): Promise<AuthPasswordChangedOutput> {
    try {
      const { data } = request;
      const user = await this.findUserByKey(request.data[0].user_id, false);
      const isCorrectPassword = await AuthHelper.comparePwds(
        data[0].old_password,
        user.password
      );

      if (isCorrectPassword) {
        const hashedPassword = await AuthHelper.hash(data[0].new_password);
        await this.aitGraphQLService.save({
          data: [
            {
              ...user,
              password: hashedPassword,
            },
          ],
          collection: COLLECTIONS.USER
        });
        return {
          status: 200,
          message: 'success',
          data: user,
          error_code: '',
        };
      }
      return {
        status: null,
        message: 'Password is not correct',
        data: null,
        error_code: 'E0107',
      };
    } catch (error) {
      Logger.log(error);
    }
  }

  private async findUserByEmail(email: string) {
    const aql = `FOR data IN ${COLLECTIONS.USER}
                    FILTER data.email == "${email}"
                    RETURN data`;
    try {
      const res = await this.db.query(aql);
      const rawData = [];
      for await (const data of res) {
        rawData.push(data);
      }
      return rawData[0] as AuthLoginInput;
    } catch (error) {
      Logger.error(error);
    }
  }

  private async findUserByUserName(username: string) {
    const aql = `FOR data IN ${COLLECTIONS.USER}
                    FILTER data.username == "${username}"
                    RETURN data`;
    try {
      const res = await this.db.query(aql);
      const rawData = [];
      for await (const data of res) {
        rawData.push(data);
      }
      return rawData[0] as AuthLoginInput;
    } catch (error) {
      Logger.error(error);
    }
  }

  public async findUserByKey(_key: string, isExclude?: boolean) {
    const aql = `FOR data IN ${COLLECTIONS.USER}
                    FILTER data._key == "${_key}"
                    RETURN data`;
    try {
      const res = await this.db.query(aql);
      const rawData = [];
      for await (const data of res) {
        rawData.push(data);
      }
      if (isExclude) {
        return rawData[0] as AuthLoginInput;
      }
      return rawData[0];
    } catch (error) {
      Logger.error(error);
    }
  }
  public async validateToken(jwt: string) {
    return await this.jwt.verifyAsync(jwt);
  }

  public generateTokenByRefreshToken = async (
    rsToken: string
  ): Promise<any> => {
    try {
      const isValidToken = await this.validateToken(rsToken);
      if (isValidToken) {
        const _payload: any = {
          user_key: isValidToken.user_key,
        };
        const newToken = await this.jwt.signAsync(_payload, {
          expiresIn: '86400s',
        });
        const refreshToken = await this.jwt.signAsync(_payload, {
          expiresIn: '172800s',
        });
        return {
          token: newToken,
          refreshToken,
          timeLog: new Date(Date.now()),
        };
      }
    } catch (e) {
      Logger.error(e);
      return e;
    }
  };

  public generateTokenByUser = async (user_key: string): Promise<any> => {
    try {
      const _payload: any = {
        user_key,
      };
      const newToken = await this.jwt.signAsync(_payload, {
        expiresIn: '86400s',
      });
      const refreshToken = await this.jwt.signAsync(_payload, {
        expiresIn: '172800s',
      });
      return {
        token: newToken,
        refreshToken,
        timeLog: new Date(Date.now()),
      };
    } catch (e) {
      Logger.error(e);
      return e;
    }
  };
  private async signToken(user_key: string) {
    const payload = { user_key } as JwtDto;
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '86400s',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '172800s',
    });
    return {
      token,
      refreshToken,
      timeLog: new Date(Date.now()),
    };
  }

  public async checkPassword(request: AuthCheckPasswordInput) {
    try {
      const user = await this.findUserByKey(request.user_id);
      const comparePwds = await AuthHelper.comparePwds(
        request?.condition.password,
        user.password
      );
      return {
        isMatched: comparePwds,
      };
    } catch (error) {
      return {
        isMatched: false,
      };
    }
  }

  validateUser(_key: string) {
    return this.findUserByKey(_key);
  }
}
