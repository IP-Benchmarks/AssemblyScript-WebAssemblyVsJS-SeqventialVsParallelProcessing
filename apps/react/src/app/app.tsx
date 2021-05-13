import { metricsToMarkdownTable, runAllMetrics } from '@ip/benchmark';
import marked from 'marked';
import React, { useState } from 'react';

import { getData } from './shared/api';

export function App() {
    // runAllMetrics().then((metrics) => {
    //     const newMetrics = { metrics: metrics.map((x) => ({ ...x, loadTime: strMapToObj(x.loadTime), computingTime: strMapToObj(x.computingTime) })) };
    //     postData('http://localhost:3333/api/metrics', newMetrics).then((data) => {
    //         console.log(data); // JSON data parsed by `data.json()` call
    //     });
    // });

    const [webMarkdown, setWebMarkdown] = useState<string>();
    const [serverMarkdown, setServerMarkdown] = useState<string>();

    return (
        <div>
            <div className="button-wrapper">
                <button className="button" onClick={async () => setWebMarkdown(metricsToMarkdownTable(await runAllMetrics()))}>
                    Run All Metrics in Web
                </button>
                <button className="button" onClick={async () => setServerMarkdown(await getData('/metrics'))}>
                    Run All Metrics on Server
                </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: webMarkdown ? marked(webMarkdown) : '' }}></div>
            <div dangerouslySetInnerHTML={{ __html: serverMarkdown ? marked(serverMarkdown) : '' }}></div>
        </div>
    );
}

export default App;
