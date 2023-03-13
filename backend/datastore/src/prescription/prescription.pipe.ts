import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Prescription } from './prescription.model';
import { PrescriptionService } from './prescription.service';

@Injectable()
export class PrescriptionPipe implements PipeTransform<string, Promise<Prescription>> {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  async transform(value: string): Promise<Prescription> {
    const prescription = await this.prescriptionService.find(value);
    if (!prescription) {
      throw new BadRequestException(`Prescription with id ${value} does not exist`);
    }
    return prescription;
  }
}
