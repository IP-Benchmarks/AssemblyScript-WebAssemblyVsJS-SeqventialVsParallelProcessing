import { arrayGeneratorJs, arrayGeneratorWasm } from './src/array-generator';
import { IMetrics } from './src/interfaces/metrics.interface';
import { Metrics } from './src/lib/metrics';
import { quickSortMultithreadedJs, quickSortMultithreadedWasm } from './src/quicksort-multithreaded/nodeJs/quicksort-multithread.node';
import { quickSortJs, quickSortWasm } from './src/quicksort/quicksort';

let metricsTestsFailed = 0;

async function runMetrics(arrLength: number, arrMin: number, arrMax: number, workerArray: number[]) {
    const metrics = new Metrics(arrLength);

    await arrayGeneratorJs(arrLength, arrMin, arrMax, metrics);
    const array = await arrayGeneratorWasm(arrLength, arrMin, arrMax, metrics);
    const sortedArray = array.sort((a, b) => (a > b ? 1 : -1));

    await runSequential(array, sortedArray, metrics);

    workerArray.forEach(async (workerNumber) => {
        await runMultithreaded(array, sortedArray, workerNumber, metrics);
    });

    return metrics;
}

async function runSequential(array: number[], sortedArray: number[], metrics: IMetrics) {
    testArray(sortedArray, await quickSortJs(array, metrics), 'quickSortJs failed');
    testArray(sortedArray, await quickSortWasm(array, metrics), 'quickSortWasm failed');
}

async function runMultithreaded(array: number[], sortedArray: number[], workers: number, metrics: IMetrics) {
    testArray(sortedArray, await quickSortMultithreadedJs(array, workers), `quickSortMultithreadedJs - ${workers} - failed`);
    testArray(sortedArray, await quickSortMultithreadedWasm(array, workers), `quickSortMultithreadedWasm - ${workers} - failed`);
}

function testArray(sorted: number[], checkArray: number[], message: string) {
    if (JSON.stringify(sorted) !== JSON.stringify(checkArray)) {
        metricsTestsFailed++;
        console.error(message);
    }
}

function runAllMetrics() {
    const arraySizes = [
        20000000,
        10000000,
        5000000,
        2500000,
        1000000,
        500000,
        250000,
        100000,
        50000,
        25000,
        10000,
        5000,
        2500,
        1000,
        500,
        250,
        100,
        50,
        25,
        10,
        5,
        3,
    ];

    const workers = [1, 2, 5, 10, 50, 100, 1000];
    arraySizes.forEach((size) => runMetrics(size, 0, 20000, workers));
    console.log('Tests failed:', metricsTestsFailed);
}

runAllMetrics();
