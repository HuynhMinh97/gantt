import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthLoginInput } from '../dtos/auth-login.dto';
import { AuthRegisterInput } from '../dtos/auth-register.dto';
import { UserToken } from '../entities/user-token.entity';

import { AuthService } from '../services/ait-auth.service';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { AitBaseService } from '../services/ait-base.service';
import {
  AitSysUserRequest,
  SysUser,
  SysUserInput,
} from '../entities/sys-user.entity';
import {
  ValidatedToken,
  AuthValidatedInput,
} from '../dtos/validated-token.dto';
import {
  AuthPasswordChangedOutput,
  AuthPasswordChanged,
  AuthCheckPassword,
  AuthCheckPasswordInput,
} from '../dtos/auth-change-password.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly graphqlService: AitBaseService
  ) {}
  @Mutation(() => UserToken)
  login(@Args('input', { type: () => AuthLoginInput }) input: AuthLoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => UserToken)
  register(
    @Args('input', { type: () => AuthRegisterInput }) input: AuthRegisterInput
  ) {
    return this.authService.register(input);
  }

  @Mutation(() => String)
  setEncryptPassword(@Args('input') password: string) {
    return this.authService.setPasswordEncrypt(password);
  }

  @Mutation(() => UserToken)
  async generateToken(@Args('input') input: string) {
    return await this.authService.generateTokenByUser(input);
  }

  @Mutation(() => AuthPasswordChangedOutput)
  async changePassword(
    @Args('input', { type: () => AuthPasswordChanged })
    input: AuthPasswordChanged
  ) {
    const result = await this.authService.handleChangePassword(input);
    // console.log(input, result);
    return result;
  }

  @Mutation(() => SysUser)
  async findUser(
    @Args('input', { type: () => SysUserInput }) input: SysUserInput
  ) {
    const result = await this.authService.findUserByKey(input._key);
    return result;
  }

  @Query(() => [SysUser], { name: 'findByConditionUser' })
  async findByCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => AitSysUserRequest })
    request: AitSysUserRequest
  ) {
    const res = await this.graphqlService.find(request);
    return res.data;
  }

  @Query(() => AuthCheckPassword, { name: 'checkPassword' })
  async checkPassword(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => AuthCheckPasswordInput })
    request: AuthCheckPasswordInput
  ) {
    return await this.authService.checkPassword(request);
  }

  @Mutation(() => ValidatedToken)
  async validateToken(
    @Args('input', { type: () => AuthValidatedInput }) input: AuthValidatedInput
  ) {
    try {
      const check = await this.authService.validateToken(input.refresh_token);
      if (check.name === 'TokenExpiredError') {
        return {
          token_valid: false,
          timeLog: Date.now(),
        };
      }
      return {
        token_valid: true,
        timeLog: Date.now(),
      };
    } catch (error) {
      return {
        token_valid: false,
        timeLog: Date.now(),
      };
    }
  }
}
