import { loadJsModule } from '@ip/benchmark/glue/module-loader';

import type { QuickSort } from '@ip/wasm-generated-js';

const jsModule = loadJsModule<typeof QuickSort>(await import('@ip/wasm-generated-js-import/quicksort.js'));

globalThis.onmessage = async ({ data }) => {
    const { array } = data;
    const sortedArr = jsModule.quickSort(array);
    globalThis.postMessage(sortedArr);
};
