import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './google.strategy';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [UserModule, PassportModule.register({session: true})],
    providers: [AuthService, GoogleStrategy, SessionSerializer, LocalStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
