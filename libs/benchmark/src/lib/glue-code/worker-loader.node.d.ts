import { NodeWorker } from '@ip/benchmark/glue/worker-implementation';

declare module 'worker-loader!*.node.worker' {
    // You need to change `Worker`, if you specified a different value for the `workerType` option
    class WebpackWorker extends NodeWorker {
        constructor();
    }

    // Uncomment this if you set the `esModule` option to `false`
    // export = WebpackWorker;
    export default WebpackWorker;
}
