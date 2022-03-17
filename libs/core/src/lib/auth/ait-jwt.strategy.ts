import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/ait-auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtDto, SECRET_KEY } from '@ait/shared';

@Injectable()
export class AitJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY,
    });
  }

  async validate(payload: JwtDto) {
    const user = await this.authService.validateUser(payload.user_key);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
