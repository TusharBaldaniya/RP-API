import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// import { JwtPayload } from '../dto/jwt.dto';
// import { AuthenticationService } from '../authentication.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'this-is-my-secret',
    });
  }

  async validate(payload: any) {
    console.log('come')
    let user = {};
    // user = await this.userService.validateUser(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
