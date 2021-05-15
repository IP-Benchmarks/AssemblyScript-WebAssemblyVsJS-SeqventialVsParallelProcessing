import { timer } from '@ip/benchmark/glue/performance-counter';

import { IMetrics } from './../interfaces/metrics.interface';

export class Metrics implements IMetrics {
    loadTime = {};
    computingTime = {};
    startTime: number | undefined;

    constructor(public arrayLength: number, reconstructObject?: IMetrics) {
        if (reconstructObject) {
            this.loadTime = reconstructObject.loadTime ?? {};
            this.computingTime = reconstructObject.computingTime ?? {};
            arrayLength = reconstructObject.arrayLength;
        }
    }
    loadTimeEntries() {
        return Object.entries(this.loadTime) as Array<[string, string | number]>;
    }
    computingTimeEntries() {
        return Object.entries(this.computingTime) as Array<[string, string | number]>;
    }

    setLoadTime(key: string, value: string | number) {
        this.loadTime[key] = value;
    }
    setComputingTime(key: string, value: string | number) {
        this.computingTime[key] = value;
    }
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
        const loadTime = metric
            .loadTimeEntries()
            .map(([x]) => ` ${x} (ms) |`)
            .join('');
        const loadTimeSlots = metric
            .loadTimeEntries()
            .map(() => ' - |')
            .join('');
        return `
        | Amount of numbers | ${loadTime} 
        | - | ${loadTimeSlots} 
        `;
    };
    const createHeaderComputingTime = (metric: IMetrics) => {
        const computingTime = metric
            .computingTimeEntries()
            .map(([x]) => ` ${x} (ms) |`)
            .join('');

        const computingTimeSlots = metric
            .computingTimeEntries()
            .map(() => ' - |')
            .join('');

        return `
        | Amount of numbers | ${computingTime}
        | - |  ${computingTimeSlots}
        `;
    };
    const createBodyLoadingTime = (metrics: IMetrics[]) => {
        const loadTime = (metric: IMetrics) =>
            metric
                .loadTimeEntries()
                .map(([_, x]) => ` ${x} |`)
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
            metric
                .computingTimeEntries()
                .map(([_, x]) => ` ${x} |`)
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
