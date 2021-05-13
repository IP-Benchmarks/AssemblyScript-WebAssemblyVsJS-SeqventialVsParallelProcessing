//@ts-nocheck
import Worker from 'worker-loader!../quicksort-multithreaded/workers/quicksort-multithread.node.worker';
import WasmWorker from 'worker-loader!../quicksort-multithreaded/workers/quicksort-multithread.wasm.node.worker';

export function getWorker(type: 'wasm' | 'js') {
    return (initialData: object, callback: (data: any) => void) => {
        const worker =
            type === 'wasm'
                ? new WasmWorker().createWorker({
                      workerData: {
                          ...initialData,
                      },
                  })
                : new Worker().createWorker({
                      workerData: {
                          ...initialData,
                      },
                  });
        return worker.on('message', (data) => callback(data));
    };
}
