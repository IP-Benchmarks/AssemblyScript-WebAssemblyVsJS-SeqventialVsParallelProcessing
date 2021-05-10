import { loadJsModule } from '../../lib/module-loader';

import type QuickSortJs from '../../../wasm/js/quicksort';
onmessage = async ({ data }) => {
    const jsModule = await loadJsModule<typeof QuickSortJs>('../../../wasm/js/quicksort.js');
    const { array } = data;
    const sortedArr = jsModule.quickSort(array);
    postMessage(sortedArr);
};
