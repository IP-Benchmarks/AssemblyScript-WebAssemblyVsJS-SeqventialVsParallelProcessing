export interface IMetrics {
    arrayLength: number;
    loadTime: Map<string, number | string>;
    computingTime: Map<string, number | string>;

    start: () => void;
    stop: () => string;
}

export enum MetricsTypes {
    LoadTime = 'Load Time',
    ComputingTime = 'Computing Time',

    ArrayGeneration = 'Array generation',

    Wasm = 'WASM',
    Js = 'JavaScript',
}
