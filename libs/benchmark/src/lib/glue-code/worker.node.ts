//@ts-nocheck
import Worker from 'worker-loader!../quicksort-multithreaded/workers/quicksort-multithread.node.worker';
import WasmWorker from 'worker-loader!../quicksort-multithreaded/workers/quicksort-multithread.wasm.node.worker';
import { Worker as NodeWorker } from 'worker_threads';

export function getWorker(type: 'wasm' | 'js') {
    return (initialData: object, callback: (data: any) => void) => {
        const worker: NodeWorker = type === 'wasm' ? new WasmWorker().createWorker() : new Worker().createWorker();
        worker.postMessage(initialData);
        worker.on('message', (data) => callback(data));
        return worker;
    };
}

export function reuseWorker(worker: NodeWorker, data: any, callback: (data: any) => void) {
    worker.postMessage(data);
    worker.on('message', (data) => callback(data));
}
