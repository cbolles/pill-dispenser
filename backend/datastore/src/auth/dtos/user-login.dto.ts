import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserLogin {
  @Field()
  username: string;

  @Field()
  password: string;
}
