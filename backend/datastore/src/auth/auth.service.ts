import { Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import { UserLogin } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async auth(credentials: UserLogin): Promise<string> {
    if (credentials.username == 'bob' && credentials.password == 'bob') {
      const payload = { _id: 'bob', username: 'bob' };
      return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException('User login failed');
  }
}
