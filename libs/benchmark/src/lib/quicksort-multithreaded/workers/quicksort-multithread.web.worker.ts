import { loadJsModule } from '@ip/benchmark/glue/module-loader';

import type { QuickSort } from '@ip/wasm-generated-js';

let jsModule: typeof QuickSort;
globalThis.onmessage = async ({ data }) => {
    if (!jsModule) jsModule = loadJsModule<typeof QuickSort>(await import('@ip/wasm-generated-js-import/quicksort.js'));
    const { array } = data;
    const sortedArr = jsModule.quickSort(array);
    globalThis.postMessage(sortedArr);
};
