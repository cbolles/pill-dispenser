import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PrescriptionService } from './prescription.service';
import { Prescription } from './prescription.model';
import { NewPrescription } from './dtos/new-prescription.dto';

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
}
