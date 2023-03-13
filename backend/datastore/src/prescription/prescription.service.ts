import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewPrescription } from './dtos/new-prescription.dto';
import { Prescription, PrescriptionDocument } from './prescription.model';

@Injectable()
export class PrescriptionService {
  constructor(@InjectModel(Prescription.name) private readonly prescriptionModel: Model<PrescriptionDocument>) {}

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionModel.find().exec();
  }

  async createPrescription(prescription: NewPrescription): Promise<Prescription> {
    return this.prescriptionModel.create(prescription);
  }
}
