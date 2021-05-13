import { timer } from '@ip/benchmark/glue/performance-counter';

import { IMetrics } from './../interfaces/metrics.interface';

export class Metrics implements IMetrics {
    loadTime = new Map<string, number | string>();
    computingTime = new Map<string, number | string>();
    startTime: number | undefined;

    constructor(public arrayLength: number) {}
    start() {
        this.startTime = timer().now();
    }
    stop() {
        return (timer().now() - (this.startTime ? this.startTime : 0)).toFixed(3);
    }
}

export function metricsToMarkdownTable(metrics: IMetrics[]) {
    console.log(metrics);
    function createHeader(metric: IMetrics) {
        const loadTime = Array.from(metric.loadTime.keys())
            .map((x) => ` ${x} (ms) |`)
            .join('');
        const computingTime = Array.from(metric.computingTime.keys())
            .map((x) => ` ${x} (ms) |`)
            .join('');

        const loadTimeSlots = Array.from(metric.loadTime.keys())
            .map(() => ' - |')
            .join('');
        const computingTimeSlots = Array.from(metric.computingTime.keys())
            .map(() => ' - |')
            .join('');

        return `
        | Amount of numbers | ${loadTime} ${computingTime}
        | - | ${loadTimeSlots} ${computingTimeSlots}
        `;
    }

    function createBody(metrics: IMetrics[]) {
        const loadTime = (metric: IMetrics) =>
            Array.from(metric.loadTime.values())
                .map((x) => ` ${x} |`)
                .join('');
        const computingTime = (metric: IMetrics) =>
            Array.from(metric.computingTime.values())
                .map((x) => ` ${x} |`)
                .join('');
        return metrics
            .map(
                (metric) => `| ${metric.arrayLength} | ${loadTime(metric)} ${computingTime(metric)}
        `
            )
            .join('');
    }
    if (metrics.length === 0) return '';
    return createHeader(metrics[0]) + createBody(metrics);
}
