import { runAllMetrics } from '@ip/benchmark';
import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hello')
    getData(): { message: string } {
        return this.appService.getData();
    }

    // @Get('metrics')
    // async getMetrics(@Query('maxValue') maxValue: number, @Query('workers', new ValidationPipe({ transform: true })) workers: number[]): Promise<IMetrics[]> {
    //     console.log(maxValue, workers);
    //     return await runAllMetrics(maxValue, workers);
    // }

    @Post('metrics')
    async postMetrics(@Body() data: { maxValue: number; workers: number[] }) {
        return await runAllMetrics(data.maxValue, data.workers);
    }
}
