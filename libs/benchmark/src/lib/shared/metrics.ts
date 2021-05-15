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
    const createHeaderLoadingTime = (metric: IMetrics) => {
        const loadTime = Array.from(metric.loadTime.keys())
            .map((x) => ` ${x} (ms) |`)
            .join('');
        const loadTimeSlots = Array.from(metric.loadTime.keys())
            .map(() => ' - |')
            .join('');
        return `
        | Amount of numbers | ${loadTime} 
        | - | ${loadTimeSlots} 
        `;
    };
    const createHeaderComputingTime = (metric: IMetrics) => {
        const computingTime = Array.from(metric.computingTime.keys())
            .map((x) => ` ${x} (ms) |`)
            .join('');

        const computingTimeSlots = Array.from(metric.computingTime.keys())
            .map(() => ' - |')
            .join('');

        return `
        | Amount of numbers | ${computingTime}
        | - |  ${computingTimeSlots}
        `;
    };
    const createBodyLoadingTime = (metrics: IMetrics[]) => {
        const loadTime = (metric: IMetrics) =>
            Array.from(metric.loadTime.values())
                .map((x) => ` ${x} |`)
                .join('');

        return metrics
            .map(
                (metric) => `| ${metric.arrayLength} | ${loadTime(metric)} 
        `
            )
            .join('');
    };

    const createBodyComputingTime = (metrics: IMetrics[]) => {
        const computingTime = (metric: IMetrics) =>
            Array.from(metric.computingTime.values())
                .map((x) => ` ${x} |`)
                .join('');
        return metrics
            .map(
                (metric) => `| ${metric.arrayLength} |  ${computingTime(metric)}
        `
            )
            .join('');
    };
    if (metrics.length === 0) return '';
    return `${createHeaderLoadingTime(metrics[0])} ${createBodyLoadingTime(metrics)}  
    ${createHeaderComputingTime(metrics[0])} ${createBodyComputingTime(metrics)}`;
}
