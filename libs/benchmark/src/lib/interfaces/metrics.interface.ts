export interface IMetrics {
    arrayLength: number;
    loadTime: Record<string, number | string>;
    computingTime: Record<string, number | string>;

    start: () => void;
    stop: () => string;

    loadTimeEntries: () => Array<[string, number | string]>;
    computingTimeEntries: () => Array<[string, number | string]>;
    setLoadTime(key: string, value: string | number): void;
    setComputingTime(key: string, value: string | number): void;
}

export enum MetricsTypes {
    LoadTime = 'Load Time',
    ComputingTime = 'Computing Time',
    ArrayGeneration = 'Array generation',
    QuickSort = 'QuickSort',
    QuickSortMultithreaded = 'QuickSort Multithreaded',
    Wasm = 'WASM',
    Js = 'JavaScript',
}
