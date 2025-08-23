import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controler';

@Module({
    imports: [],
    controllers: [HealthCheckController],
    providers: [],
    exports: []
})
export class HealthCheckModule { }
