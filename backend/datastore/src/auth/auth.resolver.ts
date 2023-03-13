import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserLogin } from './dtos/user-login.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return "world";
  }

  @Mutation(() => String)
  async login(@Args('credentials') credentials: UserLogin): Promise<string> {
    return this.authService.auth(credentials);
  }
}
