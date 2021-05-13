import { getWorker } from '@ip/benchmark/glue/worker';

import { IMetrics, MetricsTypes } from '../interfaces/metrics.interface';
import { chunkArray } from '../shared/utils';

export async function quickSortMultithreadedWasm(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, 'wasm', MetricsTypes.Wasm, metrics);
}

export async function quickSortMultithreadedJs(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, 'js', MetricsTypes.Js, metrics);
}

async function runWorker(array: number[], workers: number, workerType: 'wasm' | 'js', type: MetricsTypes.Wasm | MetricsTypes.Js, metrics: IMetrics) {
    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));
    const createWorkerType = getWorker(workerType);
    metrics.start();
    for (let i = 0; i < chunks.length; i++) {
        workerPromises.push(
            new Promise<number[]>((resolve) => {
                createWorkerType(
                    {
                        array: chunks[i],
                    },
                    (data) => resolve(data)
                );
            })
        );
    }

    const results = await Promise.all(workerPromises);
    metrics.computingTime.set(`${MetricsTypes.QuickSortMultithreaded} - ${type}`, metrics.stop());
    return results.flat();
}
