import { arrayGeneratorJs, arrayGeneratorWasm } from './src/array-generator';
import { quickSortJs, quickSortWasm } from './src/quicksort';
import { quickSortMultithreadedJs, quickSortMultithreadedWasm } from './src/quicksort-multithread.node';

async function main() {
    const maxInt32 = 20000000;
    console.log('Ammount of numbers:', maxInt32);
    await arrayGeneratorJs(maxInt32);
    const array = await arrayGeneratorWasm(maxInt32);

    await quickSortJs(array);
    await quickSortWasm(array);

    await quickSortMultithreadedJs(array);
    await quickSortMultithreadedWasm(array);
}
main();
