import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // 3. Repository를 사용하기 위해 TypeORM 모듈 import
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
