import { IMetrics, runAllMetrics } from '@ip/benchmark';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hello')
    getData(): { message: string } {
        return this.appService.getData();
    }

    @Get('metrics')
    async getMetrics(): Promise<IMetrics[]> {
        return await runAllMetrics();
    }

    // @Post('metrics')
    // postMetrics(@Body() metrics: { metrics: IMetrics[] }) {
    //     console.log(metrics.metrics);
    //     return metrics;
    // }
}
