export function getWorker() {
    return (pathToWorker: string, initialData: object, callback: (data: any) => void) => {
        const worker = new Worker(pathToWorker);
        worker.postMessage(initialData);
        worker.onmessage = ({ data }) => {
            callback(data);
        };
        return worker;
    };
}
