import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {InjectModel} from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from './user.model';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.publicKey')
    });
  }

  async validate(payload: { _id: string }): Promise<User> {
    const user = await this.userModel.findById(payload._id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
