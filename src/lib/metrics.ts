import { IMetrics } from './../interfaces/metrics.interface';
import { getTime } from './performance-counter';

export class Metrics implements IMetrics {
    loadTime = new Map<string, number | string>();
    computingTime = new Map<string, number | string>();
    startTime: number | undefined;

    constructor(public arrayLength: number) {}
    start() {
        this.startTime = getTime();
    }
    stop() {
        return (getTime() - (this.startTime ?? 0)).toFixed(3);
    }
}
