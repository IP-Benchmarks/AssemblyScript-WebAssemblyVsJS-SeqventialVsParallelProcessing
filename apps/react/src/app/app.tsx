import { IMetrics, Metrics, metricsTo, metricsToCsv, metricsToMarkdownTable, runAllMetrics } from '@ip/benchmark';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { postData } from './shared/api';

export function App() {
    const download = (data: string, fileName: string) => {
        let blob = new Blob([data], { type: 'application/blob' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        link.remove();
        URL.revokeObjectURL(link.href);
    };

    function downloadMetricsToCsv(metrics: IMetrics[], prependName: string) {
        const results = metricsToCsv(metrics);
        download(results.headerLoadingTime + results.bodyLoadingTime, prependName + 'LoadingTime.csv');
        download(results.headerComputingTime + results.bodyComputingTime, prependName + 'ComputingTime.csv');
    }

    function downloadMetricsToMarkdown(metrics: IMetrics[], prependName: string) {
        const results = metricsToMarkdownTable(metrics);
        download(results.headerLoadingTime + results.bodyLoadingTime, prependName + 'LoadingTime.md');
        download(results.headerComputingTime + results.bodyComputingTime, prependName + 'ComputingTime.md');
    }

    function metricsToTable(metrics: IMetrics[]) {
        const results = metricsTo(
            metrics,
            (entries) => {
                const headers = entries.map(([x]) => <th key={x}>{x + ' (ms)'}</th>);

                return (
                    <tr>
                        <th key={'Amount of numbers'}>Amount of numbers</th>
                        {headers}
                    </tr>
                );
            },
            (callback) => {
                const dataCell = (metric: IMetrics, index: number) => callback(metric).map(([key, value]) => <td key={key + index}>{value}</td>);
                return metrics.map((metric, index) => (
                    <tr key={index} className={index === 0 ? 'red' : ''} data-tip={index === 0 ? 'Before JIT' : 'After JIT'}>
                        <td key={'Amount of numbers' + index}>{metric.arrayLength}</td>
                        {dataCell(metric, index)}
                    </tr>
                ));
            }
        );

        if (metrics.length === 0) return <table></table>;
        return (
            <div>
                <ReactTooltip />
                <h1 className="heading">Loading Time</h1>
                <table className="table">
                    <thead>{results.headerLoadingTime}</thead>
                    <tbody>{results.bodyLoadingTime}</tbody>
                </table>

                <h1 className="heading">Computing Time</h1>
                <table className="table">
                    <thead>{results.headerComputingTime}</thead>
                    <tbody>{results.bodyComputingTime}</tbody>
                </table>
            </div>
        );
    }

    const [webMetrics, setWebMetrics] = useState<IMetrics[]>();
    const [serverMetrics, setServerMetrics] = useState<IMetrics[]>();

    const [maxValue, setMaxValue] = useState<number>(50);
    const [workers, setWorkers] = useState<number[]>([2, 3]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
        <div>
            <div className="button-wrapper">
                <p>Max value:</p>
                <input type="text" placeholder="Max value" onChange={(event) => setMaxValue(Number(event.target.value))} value={maxValue}></input>
                <p>Workers:</p>
                <input
                    type="text"
                    placeholder="Step"
                    onChange={(event) => setWorkers(event.target.value.split(',').map(Number))}
                    value={workers.join(',')}
                ></input>
                <a
                    href="#"
                    className="button"
                    onClick={async () => {
                        setIsLoading(true);
                        setWebMetrics(await runAllMetrics(maxValue, workers));
                        setIsLoading(false);
                    }}
                >
                    Run All Metrics in Web
                </a>
                <a
                    href="#"
                    className="button"
                    onClick={async () => {
                        setIsLoading(true);
                        setServerMetrics(await postData(`/metrics`, { maxValue, workers }).then((metrics) => metrics.map((x) => new Metrics(0, x))));
                        setIsLoading(false);
                    }}
                >
                    Run All Metrics on Server
                </a>
                <a
                    href="#"
                    className="button"
                    onClick={async () => {
                        if (webMetrics) downloadMetricsToCsv(webMetrics, 'Web metrics - ');
                        if (serverMetrics) downloadMetricsToCsv(serverMetrics, 'Server metrics - ');
                    }}
                >
                    Save To CSV
                </a>
                <a
                    href="#"
                    className="button"
                    onClick={async () => {
                        if (webMetrics) downloadMetricsToMarkdown(webMetrics, 'Web metrics - ');
                        if (serverMetrics) downloadMetricsToMarkdown(serverMetrics, 'Server metrics - ');
                    }}
                >
                    Save To Markdown
                </a>
            </div>
            {isLoading ? <h1>Loading...</h1> : <></>}

            {webMetrics ? (
                <div className="table-wrapper">
                    <h1 className="heading">Web Metrics</h1>
                    {metricsToTable(webMetrics)}
                </div>
            ) : null}

            {serverMetrics ? (
                <div className="table-wrapper">
                    <h1 className="heading">Server Metrics</h1>
                    {metricsToTable(serverMetrics)}
                </div>
            ) : null}
        </div>
    );
}

export default App;
