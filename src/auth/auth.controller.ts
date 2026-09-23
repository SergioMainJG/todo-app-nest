import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { PrismaExceptionsFilter } from '../shared/prisma-exceptions-filter/prisma-exceptions.filter.js';
import { ResponseUserDto } from './dto/response-user.dto.js';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @UseFilters(PrismaExceptionsFilter)
  async register(@Body({schema: RegisterUserDto}) registerUserDto: RegisterUserDto): Promise<ResponseUserDto> {
    const user = await this.authService.register(registerUserDto);
    
    return ResponseUserDto.assert({
      ...user,
      token: await this.jwtService.signAsync({ id: user.id, fullName: user.fullName, email: user.email }),
    });
  }

  @Post('login')
  async login(@Body({schema: LoginUserDto}) loginUserDto: LoginUserDto ){
    const user = await this.authService.login(loginUserDto);

    return ResponseUserDto.assert({
      ...user,
      token: await this.jwtService.signAsync({ id: user.id, fullName: user.fullName, email: user.email }),
    });
  }
}
