import { arrayGeneratorJs, arrayGeneratorWasm } from './src/array-generator';
import { Metrics } from './src/lib/metrics';
import { quickSortMultithreadedJs, quickSortMultithreadedWasm } from './src/quicksort-multithreaded/nodeJs/quicksort-multithread.node';
import { quickSortJs, quickSortWasm } from './src/quicksort/quicksort';

async function runTest(arrLength: number, arrMin: number, arrMax: number) {
    const metrics = new Metrics(arrLength);

    console.log('Ammount of numbers:', arrLength);
    await arrayGeneratorJs(arrLength, arrMin, arrMax, metrics);
    const array = await arrayGeneratorWasm(arrLength, arrMin, arrMax, metrics);

    const sortedArr = array.sort((a, b) => (a > b ? 1 : -1));

    const quickSortJsArray = await quickSortJs(array);
    const quickSortWasmArray = await quickSortWasm(array);
    const quickSortMultithreadedJsArray = await quickSortMultithreadedJs(array, 3);
    const quickSortMultithreadedWasmArray = await quickSortMultithreadedWasm(array, 3);

    console.log('quickSortJsArray: ', testArray(sortedArr, quickSortJsArray));
    console.log('quickSortWasmArray: ', testArray(sortedArr, quickSortWasmArray));
    console.log('quickSortMultithreadedJsArray: ', testArray(sortedArr, quickSortMultithreadedJsArray), sortedArr, quickSortMultithreadedJsArray);
    console.log('quickSortMultithreadedWasmArray: ', testArray(sortedArr, quickSortMultithreadedWasmArray), sortedArr, quickSortMultithreadedWasmArray);

    return metrics;
}
function testArray(sorted: number[], checkArray: number[]) {
    return JSON.stringify(sorted) == JSON.stringify(checkArray);
}

runTest(20, 0, 200);
