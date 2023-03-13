import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PrescriptionService } from './prescription.service';
import { Prescription } from './prescription.model';
import { NewPrescription } from './dtos/new-prescription.dto';
import { UserContext } from 'src/auth/user.decorator';
import { User } from '../auth/user.model';
import { PrescriptionPipe } from './prescription.pipe';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => Prescription)
export class PrescriptionResolver {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Query(() => [Prescription])
  async prescriptions(): Promise<Prescription[]> {
    return this.prescriptionService.findAll();
  }

  @Mutation(() => Prescription)
  async createPrescription(@Args('prescription') prescription: NewPrescription): Promise<Prescription> {
    return this.prescriptionService.createPrescription(prescription);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async addPrescriptionToUser(@UserContext() user: User, @Args('prescription', { type: () => String }, PrescriptionPipe) prescription: Prescription): Promise<boolean> {
    await this.prescriptionService.addPrescriptionToUser(user, prescription);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removePrescriptionFromUser(@UserContext() user: User, @Args('prescription', { type: () => String }, PrescriptionPipe) prescription: Prescription): Promise<boolean> {
    await this.prescriptionService.removePrescriptionFromUser(user, prescription);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Prescription])
  async prescriptionsForUser(@UserContext() user: User): Promise<Prescription[]> {
    return this.prescriptionService.getPrescriptionForUser(user);
  }
}
