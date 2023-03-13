import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewPrescription } from './dtos/new-prescription.dto';
import { Prescription, PrescriptionDocument } from './prescription.model';
import { User, UserDocument } from '../auth/user.model';

@Injectable()
export class PrescriptionService {
  constructor(@InjectModel(Prescription.name) private readonly prescriptionModel: Model<PrescriptionDocument>,
              @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionModel.find().exec();
  }

  async find(id: string): Promise<Prescription | null> {
    return this.prescriptionModel.findById(id).exec();
  }

  async addPrescriptionToUser(user: User, prescription: Prescription): Promise<void> {
    console.log(user);
    console.log(prescription);
    // If the prescription is already in the user's list, don't add it again
    if (user.prescriptions.includes(prescription._id)) {
      return;
    }

    await this.userModel.findByIdAndUpdate(user._id, { $push: { prescriptions: prescription._id } });
  }

  async getPrescriptionForUser(user: User): Promise<Prescription[]> {
    return await this.prescriptionModel.find({ _id: { $in: user.prescriptions } }).exec();
  }

  async createPrescription(prescription: NewPrescription): Promise<Prescription> {
    return this.prescriptionModel.create(prescription);
  }
}
