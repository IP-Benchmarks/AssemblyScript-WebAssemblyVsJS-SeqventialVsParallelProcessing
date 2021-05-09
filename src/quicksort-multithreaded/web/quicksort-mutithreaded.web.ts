import { loadJsModule } from './lib/module-loader';
import { getTime, timer } from './lib/performance-counter';

import type QuickSort from '../wasm/quicksort/types.d';
import type QuickSortJs from '../wasm/js/quicksort.d';

const stringify = (obj: object) => {
    return JSON.stringify(obj, function (key, value) {
        var fnBody;
        if (value instanceof Function || typeof value == 'function') {
            fnBody = value.toString();

            if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') {
                //this is ES6 Arrow Function
                return '_NuFrRa_' + fnBody;
            }
            return fnBody;
        }
        if (value instanceof RegExp) {
            return '_PxEgEr_' + value;
        }
        return value;
    });
};
export async function quickSortMultithreaded(array: number[]) {
    // const wasmModule = await loadWasmModule<typeof QuickSort>('./wasm/quicksort/optimized.wasm');
    // const { __pin, __unpin, __newArray, __getArray, __getArrayView } = wasmModule;
    // let arrayPtr = __pin(__newArray(wasmModule.i32Array_ID, array));
    // // console.log('values:', __getArray(arrayPtr).join(', '));
    // let timeNow = getTime();
    // wasmModule.quickSort(arrayPtr);
    // let delta = timer().now() - timeNow;
    // console.log('sorted values:', __getArray(arrayPtr).join(', '));
    // __unpin(arrayPtr);
    // console.log('Time spent:', delta);
}

export async function quickSortMultithreadedJs(array: number[]) {
    const jsModule = await loadJsModule<typeof QuickSortJs>('./wasm/js/quicksort.js');

    let timeNow = getTime();
    // console.log('values:', array.join(', '));

    const arr = [];
    const workerL = new Worker('./quicksort-multithread.webworker.ts');
    const workerR = new Worker('./quicksort-multithread.webworker.ts');
    const promiseL = new Promise<number[]>((resolve) => {
        workerL.onmessage = ({ data }) => {
            resolve(data);
        };
    });

    const promiseR = new Promise<number[]>((resolve) => {
        workerR.onmessage = ({ data }) => {
            resolve(data);
        };
    });

    workerL.postMessage({ arr: array.slice(0, array.length / 2), quickSort: stringify(jsModule.quickSort) });
    workerR.postMessage({ arr: array.slice(array.length / 2), quickSort: stringify(jsModule.quickSort) });

    arr.push(...(await promiseL));
    arr.push(...(await promiseR));

    const sortedArr = jsModule.quickSort(arr);
    let delta = timer().now() - timeNow;
    console.log('sorted values:', sortedArr.join(', '));
    console.log('Time spent:', delta);
}
