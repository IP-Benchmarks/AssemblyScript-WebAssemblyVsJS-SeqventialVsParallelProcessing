import { runAllMetrics } from '@ip/benchmark';
import { NodeWorker } from '@ip/benchmark/glue/worker-implementation';

//@ts-ignore
globalThis.Worker = NodeWorker;

runAllMetrics(50, [2, 3, 5]);
