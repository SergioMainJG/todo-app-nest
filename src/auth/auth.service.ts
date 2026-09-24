import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Argon2Hashing } from './helpers/argon2.hashing';
import { Users } from '../generated/prisma/client';

@Injectable()
export class AuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) { }

  async register({ fullName, email, password }: RegisterUserDto): Promise<Users>{
    const userFromDB = await this.userService.findOne( fullName );
    
    if( userFromDB )
      throw new ConflictException(`A user with that data (fullName or email) already exists!`);

    const newUser = await this.prismaService.users.create({
      data:{
        email: email,
        fullName: fullName,
        password_hash: await Argon2Hashing.hashPassword(password),
      }
    });

    return newUser;
  }

  async login({email, password}: LoginUserDto): Promise<Users> {
    const userFromDB = await this.prismaService.users.findUnique({
      where: { email: email }
    });

    if(!userFromDB) 
      throw new UnauthorizedException(`The email or password is wrong`);

    const isPasswordCorrect = await Argon2Hashing.verifyPassword(password, userFromDB.password_hash);    

    if(!isPasswordCorrect)
      throw new UnauthorizedException('The email or password is wrong');

    return userFromDB;
  }
}
