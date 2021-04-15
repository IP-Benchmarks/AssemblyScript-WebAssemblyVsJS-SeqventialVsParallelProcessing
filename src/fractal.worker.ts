// onmessage = ({ data }) => {
//     const {
//         pathToWasm,
//         loader,
//         memory,
//         config: { x, y, d },
//     } = data;

//     loader(pathToWasm, {
//         env: {
//             memory,
//         },
//     }).then((wasmModule) => {
//         wasmModule.run(x, y, d);
//         postMessage('done', '');
//     });
// };
