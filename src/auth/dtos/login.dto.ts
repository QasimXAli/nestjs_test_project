import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;

    @IsString({ message: 'Password must be a string', })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    readonly password: string;

    public static of(params: Partial<LoginDto>): LoginDto {
        const dto = new LoginDto();
        Object.assign(dto, params);
        return dto;
    }
}
