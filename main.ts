import { arrayGenerator, arrayGeneratorJs } from './src/array-generator';
import { quickSort, quickSortJs } from './src/quicksort';

async function main() {
    const array = await arrayGenerator(100);
    await arrayGeneratorJs(100);

    await quickSort(array);
    await quickSortJs(array);
}
main();
