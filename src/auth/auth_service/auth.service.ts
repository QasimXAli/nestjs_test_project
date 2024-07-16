import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async login(loginDto: LoginDto): Promise<User> {
        const { email, password } = loginDto;
        const user = await this.userService.findOne(email);
        if (!user || user.password !== password) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return user;
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
}
