import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        publicKey: configService.getOrThrow('auth.publicKey'),
        privateKey: configService.getOrThrow('auth.privateKey'),
        signOptions: { expiresIn: '4h', algorithm: 'RS256', issuer: 'cbolles' }
      })
    })
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtAuthGuard,
    JwtStrategy
  ]
})
export class AuthModule {}
