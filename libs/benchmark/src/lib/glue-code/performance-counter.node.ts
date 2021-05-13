import { Performance, performance } from 'perf_hooks';

export function timer(): Performance {
    return performance;
}
