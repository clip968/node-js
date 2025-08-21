import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async register(userDto: CreateUserDto) {
        const user = await this.userService.getUser(userDto.email);
        if (user) {
            throw new HttpException(
                'User already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const encryptedPassword = await bcrypt.hashSync(userDto.password, 10);

        try {
            const user = await this.userService.createUser({
                ...userDto,
                password: encryptedPassword,
            });
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('서버 에러', 500);
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.getUser(email);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const { password: hashedPassword, ...userInfo } = user;
        if (bcrypt.compareSync(password, hashedPassword)) {
            return userInfo;
        }
        return null;
    }
}
