import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NewPrescription {
  @Field()
  name: string;
}

