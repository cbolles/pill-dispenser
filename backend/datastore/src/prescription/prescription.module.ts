import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/user.model';
import { Prescription, PrescriptionSchema } from './prescription.model';
import { PrescriptionPipe } from './prescription.pipe';
import { PrescriptionResolver } from './prescription.resolver';
import { PrescriptionService } from './prescription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  providers: [PrescriptionService, PrescriptionResolver, PrescriptionPipe]
})
export class PrescriptionModule {}
