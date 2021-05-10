import { IMetrics, MetricsTypes } from '../interfaces/metrics.interface';
import { getPathRelativeToTheRunningScript } from '../lib/module-loader';
import { chunkArray } from '../lib/utils';
import { getWorker } from '../lib/web-worker';

export async function quickSortMultithreadedWasm(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, './src/quicksort-multithreaded/workers/quicksort-multithread.worker.wasm.js', MetricsTypes.Wasm, metrics);
}

export async function quickSortMultithreadedJs(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, './src/quicksort-multithreaded/workers/quicksort-multithread.worker.js', MetricsTypes.Js, metrics);
}

async function runWorker(array: number[], workers: number, importWorkerPath: string, type: MetricsTypes.Wasm | MetricsTypes.Js, metrics: IMetrics) {
    const importWorker = await getPathRelativeToTheRunningScript(importWorkerPath);
    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));
    const createWorkerType = getWorker();
    metrics.start();
    for (let i = 0; i < chunks.length; i++) {
        workerPromises.push(
            new Promise<number[]>((resolve) => {
                createWorkerType(
                    importWorker,
                    {
                        array: chunks[i],
                    },
                    (data) => resolve(data)
                );
            })
        );
    }

    const results = await Promise.all(workerPromises);
    metrics.loadTime.set(`${type} - ${MetricsTypes.QuickSortMultithreaded} ${MetricsTypes.ComputingTime}`, metrics.stop());
    return results.flat();
}
