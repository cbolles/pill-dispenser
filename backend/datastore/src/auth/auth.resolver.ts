import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserLogin } from './dtos/user-login.dto';
import { AuthService } from './auth.service';
import { UserSignup } from './dtos/user-signup.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'world';
  }

  @Mutation(() => String)
  async signup(@Args('credentials') credentials: UserSignup): Promise<string> {
    return this.authService.signup(credentials);
  }

  @Mutation(() => String)
  async login(@Args('credentials') credentials: UserLogin): Promise<string> {
    return this.authService.auth(credentials);
  }
}
