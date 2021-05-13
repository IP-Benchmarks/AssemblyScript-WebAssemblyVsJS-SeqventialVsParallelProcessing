import { runAllMetrics } from '@ip/benchmark';
import { NodeWorker } from '@ip/benchmark/glue/worker-implementation';

//@ts-ignore
globalThis.Worker = NodeWorker;

runAllMetrics();
