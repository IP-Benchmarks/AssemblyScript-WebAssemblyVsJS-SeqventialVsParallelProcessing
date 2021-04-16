import { Worker as NodeWorker, workerData } from 'worker_threads';

import { getPathRelativeToTheRunningScript, loadJsModule, loadWasmModule } from './lib/module-loader';
import { getTime, timer } from './lib/performance-counter';

import type QuickSort from '../wasm/quicksort/types';
import type QuickSortJs from '../wasm/js/quicksort';
function chunkArray(arr: any[], chunkLimit: number) {
    return Array.from(Array(Math.ceil(arr.length / chunkLimit)), (_, i) => arr.slice(i * chunkLimit, i * chunkLimit + chunkLimit));
}

export async function quickSortMultithreadedWasm(array: number[], workers: number = 2) {
    const wasmModule = await loadWasmModule<typeof QuickSort>('./wasm/quicksort/optimized.wasm');
    const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;

    // console.log('values:', array.join(', '));

    const workerArr: NodeWorker[] = [];
    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));

    let timeNow = getTime();
    for (let i = 0; i < workers - 1; i++) {
        workerArr.push(
            new NodeWorker(await getPathRelativeToTheRunningScript('./src/quicksort-multithread.nodeworker-wasm.js'), {
                workerData: {
                    array: chunks[i],
                },
            })
        );

        workerPromises.push(
            new Promise<number[]>((resolve) => {
                workerArr[i].on('message', (data) => {
                    resolve(data);
                });
            })
        );
    }

    const results = await Promise.all(workerPromises);
    let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, results.flat()));

    const sortedArr = wasmModule.quickSort(arrayPtr);

    let delta = timer().now() - timeNow;
    // console.log('sorted values:', __getArray(arrayPtr).join(', '));
    __unpin(arrayPtr);
    console.log('Multithreaded WASM - Time spent:', delta);
}

export async function quickSortMultithreadedJs(array: number[], workers: number = 2) {
    const jsModule = await loadJsModule<typeof QuickSortJs>('./wasm/js/quicksort.js');

    // console.log('values:', array.join(', '));

    const workerArr: NodeWorker[] = [];
    const workerPromises: Promise<number[]>[] = [];
    const chunks = chunkArray(array, Math.ceil(array.length / workers));

    let timeNow = getTime();
    for (let i = 0; i < workers - 1; i++) {
        workerArr.push(
            new NodeWorker(await getPathRelativeToTheRunningScript('./src/quicksort-multithread.nodeworker.js'), {
                workerData: {
                    array: chunks[i],
                },
            })
        );

        workerPromises.push(
            new Promise<number[]>((resolve) => {
                workerArr[i].on('message', (data) => {
                    resolve(data);
                });
            })
        );
    }

    const results = await Promise.all(workerPromises);
    const sortedArr = jsModule.quickSort(results.flat());

    let delta = timer().now() - timeNow;
    // console.log('sorted values:', sortedArr.join(', '));
    console.log('Multithreaded JS - Time spent:', delta);
}
