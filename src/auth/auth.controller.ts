import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    try {
      return await this.authService.signup(signupDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    try {
      return await this.authService.refreshToken(refreshToken);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

}
