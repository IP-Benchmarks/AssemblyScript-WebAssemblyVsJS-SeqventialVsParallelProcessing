import { Worker as NodeWorker, workerData } from 'worker_threads';

import { getPathRelativeToTheRunningScript, loadJsModule, loadWasmModule } from '../../lib/module-loader';
import { getTime, timer } from '../../lib/performance-counter';

import type QuickSort from '../../../wasm/quicksort/types';
import type QuickSortJs from '../../../wasm/js/quicksort';
function chunkArray(arr: any[], chunkLimit: number) {
    return Array.from(Array(Math.ceil(arr.length / chunkLimit)), (_, i) => arr.slice(i * chunkLimit, i * chunkLimit + chunkLimit));
}

export async function quickSortMultithreadedWasm(array: number[], workers: number = 2) {
    await loadWasmModule<typeof QuickSort>('./wasm/quicksort/optimized.wasm');
    // console.log('values:', array.join(', '));

    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));

    let timeNow = getTime();
    const importWorker = await getPathRelativeToTheRunningScript('./src/quicksort-multithread.nodeworker-wasm.js');
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
    let delta = timer().now() - timeNow;
    console.log('Multithreaded WASM - Time spent:', delta);

    return results.flat();
}

export async function quickSortMultithreadedJs(array: number[], workers: number = 2) {
    await loadJsModule<typeof QuickSortJs>('./wasm/js/quicksort.js');

    // console.log('values:', array.join(', '));

    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));

    let timeNow = getTime();
    const importWorker = await getPathRelativeToTheRunningScript('./src/quicksort-multithread.nodeworker.js');

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

    let delta = timer().now() - timeNow;
    // console.log('sorted values:', sortedArr.join(', '));
    console.log('Multithreaded JS - Time spent:', delta);
    return results.flat();
}
