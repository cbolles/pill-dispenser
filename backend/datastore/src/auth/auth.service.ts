import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLogin } from './dtos/user-login.dto';
import { UserSignup } from './dtos/user-signup.dto';
import { User, UserDocument } from './user.model';
import { hash, compare } from 'bcrypt';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
              @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
              private readonly configService: ConfigService) {}

  async signup(credentials: UserSignup): Promise<string> {
    // Make sure the user is unique
    const existingUser = await this.userModel.findOne({ username: credentials.username });
    if (existingUser) {
      throw new BadRequestException(`User with username ${credentials.username} already exists`);
    }

    // Make the password hash
    const passwordHash = await hash(credentials.password, this.configService.getOrThrow('auth.saltRounds'));

    // Insert the new user
    const newUser = await this.userModel.create({ username: credentials.username, password: passwordHash });
    return this.sign(newUser);
  }

  async auth(credentials: UserLogin): Promise<string> {
    const user = await this.userModel.findOne({ username: credentials.username });
    if (!user) {
      throw new UnauthorizedException(`User with username ${credentials.username} does not exist`);
    }

    // Compare passwords
    const passwordMatch = await compare(credentials.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    return this.sign(user);
  }

  private sign(user: User): string {
    return this.jwtService.sign(this.toPayload(user));
  }

  private toPayload(user: User): { _id: string, username: string } {
    return {
      _id: user._id.toString(),
      username: user.username
    };
  }
}
