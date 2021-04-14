import { loadJsModule } from './src/module-loader';

function main() {
    loadJsModule('./wasm/optimized.js').then((x) => {
        console.log(x);
    });
}
main();
