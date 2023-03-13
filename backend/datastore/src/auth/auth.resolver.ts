import {UnauthorizedException} from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserLogin } from './dtos/user-login.dto';

@Resolver()
export class AuthResolver {
  @Mutation(() => String)
  async login(@Args('credentials') credentials: UserLogin): Promise<string> {
    if (credentials.username == 'bob' && credentials.password == 'bob') {
      return 'token';
    }
    throw new UnauthorizedException('User login failed');
  }
}
