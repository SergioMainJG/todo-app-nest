// oxlint-disable no-this-before-super
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{    

    private logger = new Logger(PrismaService.name);

    constructor( configService: ConfigService ){
        const adapter = new PrismaPg({
            connectionString: configService.get<string>('DATABASE_URL'),
            max: 10,
        });
        super({adapter: adapter});
    }
    async onModuleInit() {
        await this.$connect();
        const res = await this.$queryRaw<{result: number}>`SELECT 1 AS CONNECTED`;
        if(res){
            this.logger.log('Connection Established');
            return;
        }
        this.logger.fatal('Connection couldn\'t create');
        throw new Error();
    }
    
    async onModuleDestroy() {
        await this.$disconnect();
    }

}
