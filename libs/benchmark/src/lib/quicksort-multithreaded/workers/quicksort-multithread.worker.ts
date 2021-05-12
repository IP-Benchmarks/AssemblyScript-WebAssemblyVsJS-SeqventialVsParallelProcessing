import { loadJsModule } from '../../glue-code/module-loader';

import type { QuickSort } from '@ip/wasm-generated-js';

onmessage = async ({ data }) => {
    const jsModule = loadJsModule<typeof QuickSort>(await import('@ip/wasm-generated-js-import/quicksort.js'));
    const { array } = data;
    const sortedArr = jsModule.quickSort(array);
    postMessage(sortedArr);
};
