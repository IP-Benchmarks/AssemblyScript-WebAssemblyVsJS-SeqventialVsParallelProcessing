import { timer } from '@ip/benchmark/glue/performance-counter';

import { IMetrics } from './../interfaces/metrics.interface';

export class Metrics implements IMetrics {
    loadTime = {};
    computingTime = {};
    startTime: number | undefined;

    constructor(public arrayLength: number, reconstructObject?: IMetrics) {
        if (reconstructObject) {
            console.log(reconstructObject);
            this.loadTime = reconstructObject.loadTime ?? {};
            this.computingTime = reconstructObject.computingTime ?? {};
            this.arrayLength = Number(reconstructObject.arrayLength);
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

export function metricsTo(
    metrics: IMetrics[],
    headerCallback: (values: Array<[string, string | number]>) => any,
    bodyCallback: (callback: (metric: IMetrics) => Array<[string, string | number]>) => any
) {
    const createHeaderLoadTime = (metric: IMetrics) => {
        return headerCallback(metric.loadTimeEntries());
    };

    const createHeaderComputingTime = (metric: IMetrics) => {
        return headerCallback(metric.computingTimeEntries());
    };

    const createBodyLoadTime = () => {
        const loadTime = (metric: IMetrics) => metric.loadTimeEntries();
        return bodyCallback(loadTime);
    };

    const createBodyComputingTime = () => {
        const computingTime = (metric: IMetrics) => metric.computingTimeEntries();
        return bodyCallback(computingTime);
    };

    return {
        headerLoadingTime: createHeaderLoadTime(metrics[0]),
        headerComputingTime: createHeaderComputingTime(metrics[0]),
        bodyLoadingTime: createBodyLoadTime(),
        bodyComputingTime: createBodyComputingTime(),
    };
}

export function metricsToMarkdownTable(metrics: IMetrics[]) {
    const results = metricsTo(
        metrics,
        (entries) => {
            const headers = entries.map(([x]) => ` ${x} (ms) |`).join('');
            const headersSlots = entries.map(() => ' - |').join('');
            return `
    | Amount of numbers | ${headers} 
    | - | ${headersSlots} 
    `;
        },
        (callback) => {
            const loadTime = (metric: IMetrics) =>
                callback(metric)
                    .map(([_, x]) => ` ${x} |`)
                    .join('');

            return metrics
                .map(
                    (metric) => `| ${metric.arrayLength} | ${loadTime(metric)} 
    `
                )
                .join('');
        }
    );
    return results;
}

export function metricsToCsv(metrics: IMetrics[]) {
    const results = metricsTo(
        metrics,
        (entries) => 'Amount of numbers, ' + entries.map(([x]) => `${x} (ms)`).join(',') + '\n',
        (callback) => {
            const computations = (metric: IMetrics) => callback(metric).map(([key, value]) => value);

            return metrics.map((metric) => `${metric.arrayLength}` + computations(metric).join(',')).join('\n');
        }
    );
    return results;
}
