import { IMetrics, runAllMetrics } from '@ip/benchmark';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

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
            const loadTime = Array.from(metric.loadTime.keys()).map((x) => <th key={x}>{x + ' (ms)'}</th>);
            const computingTime = Array.from(metric.computingTime.keys()).map((x) => <th key={x}>{x + ' (ms)'}</th>);

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
                <tr key={index} className={index === 0 ? 'red' : ''} data-tip={index === 0 ? 'Before JIT' : 'After JIT'}>
                    <td key={'Amount of numbers' + index}>{metric.arrayLength}</td>
                    {loadTime(metric, index)}
                    {computingTime(metric, index)}
                </tr>
            ));
        }
        if (metrics.length === 0) return <table></table>;
        return (
            <table className="table">
                <ReactTooltip />

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
                <a href="#" className="button" onClick={async () => setWebMetrics(await runAllMetrics())}>
                    Run All Metrics in Web
                </a>
                <a href="#" className="button" onClick={async () => setServerMetrics(await getData('/metrics'))}>
                    Run All Metrics on Server
                </a>
            </div>

            {webMetrics ? (
                <div>
                    <h1 className="heading">Web Metrics</h1>
                    {metricsToTable(webMetrics)}
                </div>
            ) : null}

            {serverMetrics ? (
                <div>
                    <h1 className="heading">Server Metrics</h1>
                    {metricsToTable(serverMetrics)}
                </div>
            ) : null}
        </div>
    );
}

export default App;
