import { getWorker, reuseWorker } from '@ip/benchmark/glue/worker';

import { IMetrics, MetricsTypes } from '../interfaces/metrics.interface';
import { chunkArray, testArray } from '../shared/utils';

export async function quickSortMultithreadedWasm(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, 'wasm', MetricsTypes.Wasm, metrics);
}

export async function quickSortMultithreadedJs(array: number[], workers: number, metrics: IMetrics) {
    return await runWorker(array, workers, 'js', MetricsTypes.Js, metrics);
}

async function runWorker(array: number[], workerNumber: number, workerType: 'wasm' | 'js', type: MetricsTypes.Wasm | MetricsTypes.Js, metrics: IMetrics) {
    const chunks = chunkArray(array, Math.ceil(array.length / workerNumber));
    const createWorkerType = getWorker(workerType);
    const workers: any[] = [];
    let workerPromises: Promise<number[]>[] = [];
    metrics.start();
    for (let i = 0; i < chunks.length; i++) {
        workerPromises.push(
            new Promise<number[]>((resolve) => {
                workers.push(
                    createWorkerType(
                        {
                            array: chunks[i],
                        },
                        (data) => resolve(data)
                    )
                );
            })
        );
    }

    const results = await Promise.all(workerPromises);
    metrics.setComputingTime(`${MetricsTypes.QuickSortMultithreaded} - ${workerNumber} Workers - ${type}`, metrics.stop());

    workerPromises = [];
    metrics.start();
    for (let i = 0; i < chunks.length; i++) {
        workerPromises.push(
            new Promise<number[]>((resolve) => {
                reuseWorker(
                    workers[i],
                    {
                        array: chunks[i],
                    },
                    (data) => resolve(data)
                );
            })
        );
    }

    const results2 = await Promise.all(workerPromises);
    metrics.setComputingTime(`${MetricsTypes.QuickSortMultithreaded} - Workers Loaded - ${workerNumber} Workers - ${type}`, metrics.stop());
    testArray(results.flat(), results2.flat(), 'Multithreaded reiteration failed');
    workers.forEach((worker) => worker.terminate());
    return results.flat();
}
