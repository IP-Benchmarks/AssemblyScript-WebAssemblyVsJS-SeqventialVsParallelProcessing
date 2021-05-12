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

export function loadJsModule<T>(module: T) {
    return module;
}

export async function loadWasmModule<T>(
    path: string,
    imports: Imports = {
        env: {},
    }
) {
    const module = await getWasmModule(path);
    return instantiateSync(module, imports).exports as T & ASUtil;
}
