import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

type Users = Prisma.UsersGetPayload<{include: {todos: true}}>

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
          },
          include: {
            todos: true
          }
        });     
    
    return user;
  }
}
