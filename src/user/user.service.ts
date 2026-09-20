import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Users } from '../generated/prisma/client.js';

@Injectable()
export class UserService {

  constructor(private readonly prismaService: PrismaService){}

  async findOne( credential: string): Promise<Users|null> {
    const user = await this.prismaService.users.findFirst({
          where: {
            OR: [
              {fullName: credential},
              {email: credential}
            ],
          }
        });      
    return user;
  }
}
