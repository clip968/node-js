import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

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

    async getUserWithPassword(email: string, password: string): Promise<User> {
        const user = await this.getUser(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
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

    async findByEmailOrSave(email, username, providerId) : Promise<User> {
        const foundUser = await this.getUser(email);
        if (foundUser) {
            return foundUser;
        }
        const newUser = await this.userRepository.save({email, username, providerId});
        return newUser;
    }
}
