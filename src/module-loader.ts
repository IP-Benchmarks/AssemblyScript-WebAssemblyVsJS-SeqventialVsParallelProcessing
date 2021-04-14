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

export async function loadJsModule(pathToModule: string) {
    if (!!require) {
        return require(await getPathRelativeToTheRunningScript(pathToModule));
    }
    return await import(pathToModule);
}

export async function loadWasmModule(path: string, imports: Imports | undefined = {}) {
    const module = await getWasmModule(path);
    return await loader.instantiate(module, imports);
}
