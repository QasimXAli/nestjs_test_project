import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { UserService } from '../user/user.service';
import { User, UserDocument } from '../user/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (!user) {
            throw new HttpException('Account doesn\'t exist', HttpStatus.NOT_FOUND);
        }
        if (!bcrypt.compareSync(pass, user.password)) {
            throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
        }
        // Convert to plain object and remove the password field
        const userObject = (user as UserDocument).toJSON();
        delete userObject.password;
        return userObject;
    }

    async login(loginDto: LoginDto): Promise<{ user: Partial<UserDocument>; access_token: string; refresh_token: string }> {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            user,
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async signup(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, password, firstname, lastname, address } = signupDto;
        const existingUser = await this.userService.findOne(email);
        if (existingUser) {
            return { message: 'User already exists' }
        }
        const user: User = {
            email,
            password,
            firstname,
            lastname,
            address,
        };
        await this.userService.create(user);
        return { message: 'User created successfully' };
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            const payload = { email: decoded.email, sub: decoded.sub };
            const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
            const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

            return {
                access_token: accessToken,
                refresh_token: newRefreshToken,
            };
        } catch (error) {
            throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
        }
    }
}
