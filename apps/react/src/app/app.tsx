import { IMetrics, runAllMetrics } from '@ip/benchmark';
import React, { useState } from 'react';

import { getData } from './shared/api';

export function App() {
    // runAllMetrics().then((metrics) => {
    //     const newMetrics = { metrics: metrics.map((x) => ({ ...x, loadTime: strMapToObj(x.loadTime), computingTime: strMapToObj(x.computingTime) })) };
    //     postData('http://localhost:3333/api/metrics', newMetrics).then((data) => {
    //         console.log(data); // JSON data parsed by `data.json()` call
    //     });
    // });

    function metricsToTable(metrics: IMetrics[]) {
        function createHeader(metric: IMetrics) {
            const loadTime = Array.from(metric.loadTime.keys()).map((x) => <th key={x}>{x}</th>);
            const computingTime = Array.from(metric.computingTime.keys()).map((x) => <th key={x}>{x}</th>);

            return (
                <tr>
                    <th key={'Amount of numbers'}>Amount of numbers</th>
                    {loadTime}
                    {computingTime}
                </tr>
            );
        }

        function createBody(metrics: IMetrics[]) {
            const loadTime = (metric: IMetrics, index: number) =>
                Array.from(metric.loadTime.entries()).map(([key, value]) => <td key={key + index}>{value}</td>);
            const computingTime = (metric: IMetrics, index: number) =>
                Array.from(metric.computingTime.entries()).map(([key, value]) => <td key={key + index}>{value}</td>);

            return metrics.map((metric, index) => (
                <tr>
                    <td key={'Amount of numbers' + index}>{metric.arrayLength}</td>
                    {loadTime(metric, index)}
                    {computingTime(metric, index)}
                </tr>
            ));
        }
        if (metrics.length === 0) return <table></table>;
        return (
            <table>
                <thead>{createHeader(metrics[0])}</thead>
                <tbody>{createBody(metrics)}</tbody>
            </table>
        );
    }

    const [webMetrics, setWebMetrics] = useState<any[]>();
    const [serverMetrics, setServerMetrics] = useState<any[]>();

    return (
        <div>
            <div className="button-wrapper">
                <button className="button" onClick={async () => setWebMetrics(await runAllMetrics())}>
                    Run All Metrics in Web
                </button>
                <button className="button" onClick={async () => setServerMetrics(await getData('/metrics'))}>
                    Run All Metrics on Server
                </button>
            </div>
            <div>{webMetrics ? metricsToTable(webMetrics) : null}</div>
            <div>{serverMetrics ? metricsToTable(serverMetrics) : null}</div>
        </div>
    );
}

export default App;
