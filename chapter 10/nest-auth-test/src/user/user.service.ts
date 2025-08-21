import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    createUser(user: CreateUserDto): Promise<User> {
        return this.userRepository.save(user);
    }

    async getUser(email: string): Promise<User> {
        const result = await this.userRepository.findOne({ where: { email } });
        console.log(result);
        return result;
    }

    async updateUser(
        email: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const user = await this.getUser(email);
        if (!user) {
            return null;
        }
        user.username = updateUserDto.username;
        user.password = updateUserDto.password;
        return this.userRepository.save(user);
    }

    deleteUser(email: any) {
        return this.userRepository.delete({ email });
    }
}
