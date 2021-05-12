import { getWorker } from '../glue-code/web-worker';
import { IMetrics, MetricsTypes } from '../interfaces/metrics.interface';
import { chunkArray } from '../shared/utils';

export async function quickSortMultithreadedWasm(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, '@ip/benchmark/quicksort-multithreaded/workers/quicksort-multithread.worker.wasm.js', MetricsTypes.Wasm, metrics);
}

export async function quickSortMultithreadedJs(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, '@ip/benchmark/quicksort-multithreaded/workers/quicksort-multithread.worker.js', MetricsTypes.Js, metrics);
}

async function runWorker(array: number[], workers: number, importWorker: string, type: MetricsTypes.Wasm | MetricsTypes.Js, metrics: IMetrics) {
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
    metrics.computingTime.set(`${MetricsTypes.QuickSortMultithreaded} - ${type}`, metrics.stop());
    return results.flat();
}
