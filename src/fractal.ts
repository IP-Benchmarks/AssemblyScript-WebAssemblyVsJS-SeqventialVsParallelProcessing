import { loadWasmModule } from './lib/module-loader';

import type Fractal from '../wasm/fractal/types';

// Compute the size of the viewport
const width = 1200;
const height = 1200;
const size = width * height;
const byteSize = size << 1; // discrete color indices in range [0, 2047] (2 bytes per pixel)

// Set up the canvas with a 2D rendering context
const canvas = new OffscreenCanvas(width, height);
const ctx = canvas.getContext('2d');
// ctx.scale(ratio, ratio);

// Compute the size (in pages) of and instantiate the module's memory.
// Pages are 64kb. Rounds up using mask 0xffff before shifting to pages.
const memory = new WebAssembly.Memory({ initial: ((byteSize + 0xffff) & ~0xffff) >>> 16 });
const buffer = new Uint16Array(memory.buffer);
const imageData = ctx!.createImageData(width, height);
const argb = new Uint32Array(imageData.data.buffer);

loadWasmModule<typeof Fractal>('../wasm/fractal/optimized.wasm', {
    env: {
        memory,
    },
}).then((fractalModule) => {
    const colors = computeColors();

    // Update state
    fractalModule.update(width, height, 40);

    // Translate 16-bit color indices to colors
    for (let y = 0; y < height; ++y) {
        const yx = y * width;
        for (let x = 0; x < width; ++x) {
            if (colors) {
                argb[yx + x] = colors[buffer[yx + x]];
            }
        }
    }

    // Render the image buffer.
    ctx?.putImageData(imageData, 0, 0);
});

/** Computes a nice set of colors using a gradient. */
function computeColors() {
    const canvas = new OffscreenCanvas(2048, 1);
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const grd = ctx.createLinearGradient(0, 0, 2048, 0);
        grd.addColorStop(0.0, '#000764');
        grd.addColorStop(0.16, '#2068CB');
        grd.addColorStop(0.42, '#EDFFFF');
        grd.addColorStop(0.6425, '#FFAA00');
        grd.addColorStop(0.8575, '#000200');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 2048, 1);
        return new Uint32Array(ctx.getImageData(0, 0, 2048, 1).data.buffer);
    }
}
