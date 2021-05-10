import { Worker as NodeWorker } from 'worker_threads';

export function getWorker() {
    return (pathToWorker: string, initialData: object, callback: (data: any) => void) => {
        const worker = new NodeWorker(pathToWorker.replace('.worker.', '.node-worker.'), {
            workerData: {
                ...initialData,
            },
        });
        return worker.on('message', (data) => callback(data));
    };
}
