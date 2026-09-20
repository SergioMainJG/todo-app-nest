import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { type } from 'arktype';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findOne(
    @Query(
      'credential', {
        schema:
          type('string.email | string.capitalize.preformatted')
        }
      ) credential: string) {
    return this.userService.findOne( credential );
  }
}
