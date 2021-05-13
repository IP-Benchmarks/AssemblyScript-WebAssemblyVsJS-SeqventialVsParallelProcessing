/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NodeWorker } from '@ip/benchmark/glue/worker-implementation';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

//@ts-ignore
globalThis.Worker = NodeWorker;
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3333;
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
    });
}

bootstrap();
