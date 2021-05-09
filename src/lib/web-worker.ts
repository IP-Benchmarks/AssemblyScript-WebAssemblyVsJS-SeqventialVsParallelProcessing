import { Worker as NodeWorker } from 'worker_threads';

export function getWorker() {
    if (!!require) {
        return (pathToWorker: string, initialData: any, callback: (data: any) => void) => {
            const worker = new NodeWorker(pathToWorker.replace('.worker.', '.node-worker.'), {
                workerData: {
                    initialData,
                },
            });
            return worker.on('message', (data) => callback(data));
        };
    }
    return (pathToWorker: string, initialData: any, callback: (data: any) => void) => {
        const worker = new Worker(pathToWorker);
        worker.postMessage(initialData);
        worker.onmessage = ({ data }) => {
            callback(data);
        };
        return worker;
    };
}
