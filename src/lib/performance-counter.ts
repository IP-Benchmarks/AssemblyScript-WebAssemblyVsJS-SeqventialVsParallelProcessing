export function timer(): Performance {
    if (!!require) {
        const { performance } = require('perf_hooks');
        return performance;
    }
    return performance;
}

export function getTime() {
    return timer().now();
}
