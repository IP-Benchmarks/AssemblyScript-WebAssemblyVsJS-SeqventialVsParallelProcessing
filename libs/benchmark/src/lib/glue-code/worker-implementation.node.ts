import { Worker } from 'worker_threads';

import { getPathRelativeToTheRunningScript } from './module-loader.node';

export class NodeWorker {
    createWorker: (initialData: object) => Worker;
    constructor(path: string) {
        this.createWorker = (initialData: object) => new Worker(getPathRelativeToTheRunningScript(path), initialData);
    }
}
