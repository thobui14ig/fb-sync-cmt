import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { RedisOptions } from 'ioredis';

@Module({
    imports: [
        NestRedisModule.forRoot({
            type: 'single',
            options: {
                host: '91.99.31.157',
                port: 6379,
            } as RedisOptions,
        }),
    ],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule { }
