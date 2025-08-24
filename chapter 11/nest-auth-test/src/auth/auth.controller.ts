import { Controller, Post, Body, Get, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthenticatedGuard, localAuthGuard, LoginGuard, GoogleAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.register(userDto);
    }

    @Post('login')
    async login(@Request() req, @Response() res) {
        const userInfo = await this.authService.validateUser(
            req.body.email,
            req.body.password,
        );

        if (userInfo) {
            res.cookie('login', userInfo.email, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
        }
        return res.send({ message: 'login success' });
    }

    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard() {
        return '로그인 될 때만 이 글이 보임';
    }

    @UseGuards(localAuthGuard)
    @Post('login3')
    login3(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Get('test-auth2')
    testGuardwithSession(@Request() req) {
        return req.user;
    }

    @Get('to-google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {}

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Response() res) {
        const {user} = req;
        return res.send({message: 'google login success', user});
    }
}
