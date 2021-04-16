import { performance } from 'perf_hooks';
import { isMainThread, parentPort, Worker as NodeWorker, workerData } from 'worker_threads';

/*
 * Multithreading qsort and merge sort implementation.
 * Written by Ethan Arrowood (https://github.com/Ethan-Arrowood) in
 * Node.js v11.2.0
 *
 * In order to run this program you must use the '--experimental-worked' flag
 * as both the 'perf_hooks' and 'worker_threads' APIs are experimental features
 */

const DATA = [7, 12, 19, 3, 18, 16, 4, 2, 6, 9, 18, 38, 15, 8, 123, 72, 4, 3, 11, 33, 15, 48, 13, 17, 23, 19, 30, 45, 31, 1, 14, 50];

const TYPE_SORT_THREAD = 'sort_thread';
const TYPE_MERGE_THREAD = 'merge_thread';

const t_start = performance.now();

if (isMainThread) {
    // Main Thread Logic

    // Split data
    const x = DATA.slice(0, DATA.length / 2);
    const y = DATA.slice(DATA.length / 2, DATA.length);

    // Define sorted array collection
    const sortedArrays: number[] = [];

    // set a function to check for sorting completion every 10 milliseconds
    const mergeOperationInterval = setInterval(mergeOperation, 10);

    function mergeOperation() {
        if (sortedArrays.length >= 2) {
            // if the two arrays have been returned clear the function interval
            clearInterval(mergeOperationInterval);
            console.log('Merge operation... ');

            // create a new thread to merge the sorted arrays
            const mergeThread = new NodeWorker(__filename, {
                workerData: {
                    type: TYPE_MERGE_THREAD,
                    sortedArrays: sortedArrays,
                },
            });

            // Merged arrays will be returned here
            mergeThread.on('message', (merged) => {
                console.log('Merge complete!');
                // Performance timing function
                console.log(sortedArrays);
                const t_end = performance.now();
                console.log(`Application took ${t_end - t_start} milliseconds to complete.`);
                console.log(merged.toString());
            });
        } else {
            console.log('Waiting on sortThreads to complete...');
        }
    }

    for (var subArray of [x, y]) {
        // create a thread for each sub array of the dataset
        let sortThread = new NodeWorker(__filename, {
            workerData: {
                array: subArray,
                type: TYPE_SORT_THREAD,
            },
        });
        // push the sorted subarray when its returned from thread
        sortThread.on('message', (sorted: number[]) => sortedArrays.push(...sorted));
    }
} else {
    // Sub Thread Logic

    // There are two types of sub threads so I am
    // using a global string Type implementation to
    // differentiate the logic
    if (workerData.type === TYPE_SORT_THREAD) {
        const { array } = workerData;
        array.sort((a: number, b: number) => a - b); // Comparator function is inlined
        parentPort?.postMessage(array);
    } else if (workerData.type === TYPE_MERGE_THREAD) {
        const [a, b] = workerData.sortedArrays;
        const merged = merge(a, b);
        parentPort?.postMessage(merged);
    }

    function merge(a: number[], b: number[]) {
        // standard merge sort algorithm implementation
        const c = [];
        while (a.length > 0 && b.length > 0) {
            if (a[0] > b[0]) c.push(b.shift());
            else c.push(a.shift());
        }
        while (a.length > 0) c.push(a.shift());
        while (b.length > 0) c.push(b.shift());
        return c;
    }
}

// import { parentPort, workerData } from 'worker_threads';

// parentPort?.once('message', (message) => {
//     const TYPE_SORT_THREAD = 'sort_thread';
// const TYPE_MERGE_THREAD = 'merge_thread';

//     if (workerData.type === TYPE_SORT_THREAD) {
//         const { array } = workerData;
//         array.sort((a: number, b: number) => a - b);
//         parentPort?.postMessage(array);
//     } else if (workerData.type === TYPE_MERGE_THREAD) {
//         const [a, b] = workerData.sortedArrays;
//         const merged = merge(a, b);
//         parentPort?.postMessage(merged);
//     }

//     function merge(a: number[], b: number[]) {
//         // standard merge sort algorithm implementation
//         const c = [];
//         while (a.length > 0 && b.length > 0) {
//             if (a[0] > b[0]) c.push(b.shift());
//             else c.push(a.shift());
//         }
//         while (a.length > 0) c.push(a.shift());
//         while (b.length > 0) c.push(b.shift());
//         return c;
//     }

// });
