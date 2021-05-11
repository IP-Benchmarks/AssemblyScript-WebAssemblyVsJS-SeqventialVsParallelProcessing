import { loadJsModule } from '../../glue-code/module-loader';

import type * as QuickSort from '../../../../../../wasm/js/quicksort.d';

onmessage = async ({ data }) => {
    const jsModule = await loadJsModule<typeof QuickSort>('./assets/wasm/js/quicksort.js');
    const { array } = data;
    const sortedArr = jsModule.quickSort(array);
    postMessage(sortedArr);
};
