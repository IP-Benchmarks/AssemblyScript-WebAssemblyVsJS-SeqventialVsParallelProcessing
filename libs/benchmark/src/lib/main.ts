import { arrayGeneratorJs, arrayGeneratorWasm } from './array-generator';
import { IMetrics } from './interfaces/metrics.interface';
import { quickSortMultithreadedJs, quickSortMultithreadedWasm } from './quicksort-multithreaded/quicksort-multithread';
import { quickSortJs, quickSortWasm } from './quicksort/quicksort';
import { Metrics } from './shared/metrics';

let metricsTestsFailed = 0;

async function runMetrics(arrLength: number, arrMin: number, arrMax: number, workerArray: number[]) {
    const metrics = new Metrics(arrLength);

    const array = await arrayGeneratorWasm(arrLength, arrMin, arrMax, metrics);
    console.log(array);
    await arrayGeneratorJs(arrLength, arrMin, arrMax, metrics);
    const sortedArray = array.sort((a: number, b: number) => (a > b ? 1 : -1));

    await runSequential(array, sortedArray, metrics);

    for (let i = 0; i < workerArray.length; i++) {
        await runMultithreaded(array, sortedArray, workerArray[i], metrics);
    }

    return metrics;
}

async function runSequential(array: number[], sortedArray: number[], metrics: IMetrics) {
    testArray(sortedArray, await quickSortJs(array, metrics), 'quickSortJs failed');
    testArray(sortedArray, await quickSortWasm(array, metrics), 'quickSortWasm failed');
}

async function runMultithreaded(array: number[], sortedArray: number[], workers: number, metrics: IMetrics) {
    testArray(sortedArray, await quickSortMultithreadedJs(array, workers, metrics), `quickSortMultithreadedJs - ${workers} - failed`);
    testArray(sortedArray, await quickSortMultithreadedWasm(array, workers, metrics), `quickSortMultithreadedWasm - ${workers} - failed`);
}

function testArray(sorted: number[], checkArray: number[], message: string) {
    if (JSON.stringify(sorted) !== JSON.stringify(checkArray)) {
        metricsTestsFailed++;
        console.error(message);
    }
}

export async function runAllMetrics() {
    const metrics: IMetrics[] = [];
    // const arraySizes = [
    //     20000000,
    //     10000000,
    //     5000000,
    //     2500000,
    //     1000000,
    //     500000,
    //     250000,
    //     100000,
    //     50000,
    //     25000,
    //     10000,
    //     5000,
    //     2500,
    //     1000,
    //     500,
    //     250,
    //     100,
    //     50,
    //     25,
    //     10,

    //     5,
    //     3,
    // ];

    // const workers = [1, 2, 5, 10, 50, 100, 1000];

    const arraySizes = [50, 25, 10, 5, 3];

    const workers = [1, 2, 5];
    for (let i = 0; i < arraySizes.length; i++) {
        metrics.push(await runMetrics(arraySizes[i], 0, 20000, workers));
    }
    console.log('Tests failed:', metricsTestsFailed);
    console.log(metrics);
    return metrics;
}
