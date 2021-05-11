import { ASUtil, Imports, instantiateSync } from '@assemblyscript/loader';

export async function getPathRelativeToTheRunningScript(relativePath: string) {
    const path = await import('path');
    let callerFunction = __filename;
    if (require && require.main && require.main.filename) {
        callerFunction = require.main.filename;
    } else {
        if (module.parent && module.parent.filename) {
            callerFunction = module.parent.filename;
        }
    }

    return path.format({
        root: '/',
        dir: path.dirname(callerFunction),
        base: path.normalize(relativePath),
    });
}
async function getWasmModule(pathToModule: string): Promise<any> {
    if (require) {
        const fs = await import('fs');
        return fs.readFileSync(await getPathRelativeToTheRunningScript(pathToModule));
    }
    return fetch(pathToModule);
}

export async function loadJsModule<T>(pathToModule: string) {
    patch();
    if (require) {
        return require(await getPathRelativeToTheRunningScript(pathToModule)) as T;
    }
    return (await import(pathToModule)) as T;
}

export async function loadWasmModule<T>(
    path: string,
    imports: Imports = {
        env: {},
    }
) {
    const module = await getWasmModule(path);
    return instantiateSync(module, imports).exports as ASUtil & T;
}

function patch() {
    //@ts-ignore
    globalThis.idof = () => {};
    //@ts-ignore
    globalThis.i32 = (x) => x;
    //@ts-ignore
    globalThis.unchecked = (x) => x;
    //@ts-ignore
    globalThis.i32.MIN_VALUE = Number.MIN_SAFE_INTEGER;
    //@ts-ignore
    globalThis.i32.MAX_VALUE = Number.MAX_SAFE_INTEGER;
}
