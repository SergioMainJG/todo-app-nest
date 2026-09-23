import { Controller, Get, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { type } from 'arktype';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(
    @Query(
      'credential', {
        schema:
          type('string.email | string.capitalize.preformatted')
        }
      ) credential: string) {
    const user  = await this.userService.findOne( credential );
    
    if(!user)
      throw new NotFoundException(`User doesn't exists`);

    const {email, fullName, id, todos} = user;

    return {
      id,
      fullName,
      email,
      todos, 
    }
  }
}
