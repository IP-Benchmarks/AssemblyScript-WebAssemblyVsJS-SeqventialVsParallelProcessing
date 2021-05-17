import { arrayGeneratorJs, arrayGeneratorWasm } from './array-generator';
import { IMetrics } from './interfaces/metrics.interface';
import { quickSortMultithreadedJs, quickSortMultithreadedWasm } from './quicksort-multithreaded/quicksort-multithread';
import { quickSortJs, quickSortWasm } from './quicksort/quicksort';
import { Metrics } from './shared/metrics';
import { testArray } from './shared/utils';

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
    testArray(sortedArray, await quickSortJs(array, metrics), 'quickSortJs failed', () => metricsTestsFailed++);
    testArray(sortedArray, await quickSortWasm(array, metrics), 'quickSortWasm failed', () => metricsTestsFailed++);
}

async function runMultithreaded(array: number[], sortedArray: number[], workers: number, metrics: IMetrics) {
    testArray(
        sortedArray,
        await quickSortMultithreadedJs(array, workers, metrics),
        `quickSortMultithreadedJs - ${workers} - failed`,
        () => metricsTestsFailed++
    );
    testArray(
        sortedArray,
        await quickSortMultithreadedWasm(array, workers, metrics),
        `quickSortMultithreadedWasm - ${workers} - failed`,
        () => metricsTestsFailed++
    );
}

export async function runAllMetrics(maxValue: number, workers: number[]) {
    const metrics: IMetrics[] = [];

    const createArray = (maxValue: number, step: number) => {
        const arr = [1, 1, workers.length];
        let currentNumber = step;
        arr.push(currentNumber);
        while (currentNumber < maxValue) {
            arr.push(currentNumber);
            currentNumber = currentNumber * step;
        }
        arr.push(maxValue);

        return arr;
    };
    const arraySizes = createArray(maxValue, 10);

    for (let i = 0; i < arraySizes.length; i++) {
        metrics.push(await runMetrics(arraySizes[i], 0, 20000, workers));
    }
    console.log('Tests failed:', metricsTestsFailed);
    // console.log(metrics);
    return metrics;
}
