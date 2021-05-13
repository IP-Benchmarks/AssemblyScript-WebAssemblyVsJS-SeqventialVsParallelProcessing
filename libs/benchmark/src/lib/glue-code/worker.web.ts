//@ts-nocheck
import WasmWorker from 'worker-loader!../quicksort-multithreaded/workers/quicksort-multithread.wasm.web.worker';
import Worker from 'worker-loader!../quicksort-multithreaded/workers/quicksort-multithread.web.worker';

export function getWorker(type: 'wasm' | 'js') {
    return (initialData: object, callback: (data: any) => void) => {
        const worker = type === 'wasm' ? new WasmWorker() : new Worker();
        worker.postMessage(initialData);
        worker.onmessage = ({ data }) => {
            callback(data);
        };
        return worker;
    };
}

export function reuseWorker(worker: Worker, data: any, callback: (data: any) => void) {
    worker.postMessage(data);
    worker.onmessage = ({ data }) => {
        callback(data);
    };
}
