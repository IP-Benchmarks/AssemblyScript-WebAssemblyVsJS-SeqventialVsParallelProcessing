export function timer(): Performance {
    const { performance } = require('perf_hooks');
    return performance;
}
