import loader, { Imports } from '@assemblyscript/loader';

async function getPathRelativeToTheRunningScript(relativePath: string) {
    const path = await import('path');
    const callerFunction = require?.main?.filename ?? module.parent?.filename ?? __filename;
    return path.format({
        root: '/',
        dir: path.dirname(callerFunction),
        base: relativePath.replace('./', '/'),
    });
}
async function getWasmModule(pathToModule: string): Promise<any> {
    if (!!require) {
        const fs = await import('fs');
        return fs.readFileSync(await getPathRelativeToTheRunningScript(pathToModule));
    }
    return fetch(pathToModule);
}

export async function loadJsModule<T = Record<string, unknown>>(pathToModule: string) {
    patchIdof();
    if (!!require) {
        return require(await getPathRelativeToTheRunningScript(pathToModule)) as loader.ASUtil & T;
    }
    return (await import(pathToModule)) as loader.ASUtil & T;
}

export async function loadWasmModule<T = Record<string, unknown>>(
    path: string,
    imports: Imports = {
        env: {},
    }
) {
    const module = await getWasmModule(path);
    return loader.instantiateSync(module, imports).exports as loader.ASUtil & T;
}

function patchIdof() {
    const idof = () => {};
    //@ts-ignore
    globalThis.idof = idof;
}
