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
        const createHeaderLoadTime = (metric: IMetrics) => {
            const loadTime = Array.from(metric.loadTime.keys()).map((x) => <th key={x}>{x + ' (ms)'}</th>);

            return (
                <tr>
                    <th key={'Amount of numbers'}>Amount of numbers</th>
                    {loadTime}
                </tr>
            );
        };

        const createHeaderComputingTime = (metric: IMetrics) => {
            const computingTime = Array.from(metric.computingTime.keys()).map((x) => <th key={x}>{x + ' (ms)'}</th>);

            return (
                <tr>
                    <th key={'Amount of numbers'}>Amount of numbers</th>
                    {computingTime}
                </tr>
            );
        };
        const createBodyLoadTime = (metrics: IMetrics[]) => {
            const loadTime = (metric: IMetrics, index: number) =>
                Array.from(metric.loadTime.entries()).map(([key, value]) => <td key={key + index}>{value}</td>);

            return metrics.map((metric, index) => (
                <tr key={index} className={index === 0 ? 'red' : ''} data-tip={index === 0 ? 'Before JIT' : 'After JIT'}>
                    <td key={'Amount of numbers' + index}>{metric.arrayLength}</td>
                    {loadTime(metric, index)}
                </tr>
            ));
        };

        const createBodyComputingTime = (metrics: IMetrics[]) => {
            const computingTime = (metric: IMetrics, index: number) =>
                Array.from(metric.computingTime.entries()).map(([key, value]) => <td key={key + index}>{value}</td>);

            return metrics.map((metric, index) => (
                <tr key={index} className={index === 0 ? 'red' : ''} data-tip={index === 0 ? 'Before JIT' : 'After JIT'}>
                    <td key={'Amount of numbers' + index}>{metric.arrayLength}</td>
                    {computingTime(metric, index)}
                </tr>
            ));
        };

        if (metrics.length === 0) return <table></table>;
        return (
            <div>
                <ReactTooltip />
                <h1 className="heading">Loading Time</h1>
                <table className="table">
                    <thead>{createHeaderLoadTime(metrics[0])}</thead>
                    <tbody>{createBodyLoadTime(metrics)}</tbody>
                </table>

                <h1 className="heading">Computing Time</h1>
                <table className="table">
                    <thead>{createHeaderComputingTime(metrics[0])}</thead>
                    <tbody>{createBodyComputingTime(metrics)}</tbody>
                </table>
            </div>
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
