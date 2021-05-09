import { IMetrics, MetricsTypes } from 'src/interfaces/metrics.interface';
import { Worker as NodeWorker } from 'worker_threads';

import { getPathRelativeToTheRunningScript } from '../../lib/module-loader';

export async function quickSortMultithreadedWasm(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, './src/quicksort-multithread.nodeworker-wasm.js', MetricsTypes.Wasm, metrics);
}

export async function quickSortMultithreadedJs(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, './src/quicksort-multithread.nodeworker.js', MetricsTypes.Js, metrics);
}

async function runWorker(array: number[], workers: number, importWorkerPath: string, type: MetricsTypes.Wasm | MetricsTypes.Js, metrics: IMetrics) {
    const importWorker = await getPathRelativeToTheRunningScript(importWorkerPath);
    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));

    metrics.start();
    for (let i = 0; i <= workers - 1; i++) {
        workerPromises.push(
            new Promise<number[]>((resolve) => {
                new NodeWorker(importWorker, {
                    workerData: {
                        array: chunks[i],
                    },
                }).on('message', (data) => {
                    resolve(data);
                });
            })
        );
    }

    const results = await Promise.all(workerPromises);
    metrics.loadTime.set(`${type} - ${MetricsTypes.QuickSortMultithreaded} ${MetricsTypes.ComputingTime}`, metrics.stop());
    return results.flat();
}
