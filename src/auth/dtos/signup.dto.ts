import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignupDto {
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    readonly password: string;

    @IsString({ message: 'First name must be a string' })
    readonly firstname: string;

    @IsString({ message: 'Last name must be a string' })
    readonly lastname: string;

    @IsString({ message: 'Address must be a string' })
    readonly address: string;

    public static of(params: Partial<SignupDto>): SignupDto {
        const dto = new SignupDto();
        Object.assign(dto, params);
        return dto;
    }
}
