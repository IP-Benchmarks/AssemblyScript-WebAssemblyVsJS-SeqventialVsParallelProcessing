import { parentPort, workerData } from 'worker_threads';

import { loadJsModule } from '../../glue-code/module-loader';

import type QuickSortJs from '../../../wasm/js/quicksort';
loadJsModule<typeof QuickSortJs>('../../../wasm/js/quicksort.js').then((jsModule) => {
    const { array } = workerData;

    const sortedArr = jsModule.quickSort(array);
    parentPort?.postMessage(sortedArr);
});