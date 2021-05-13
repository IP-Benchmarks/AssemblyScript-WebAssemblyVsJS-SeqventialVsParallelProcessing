import { Worker } from 'worker_threads';

export class NodeWorker {
    worker: Worker;
    constructor(path: string) {
        this.worker = new Worker(path);
    }
}
