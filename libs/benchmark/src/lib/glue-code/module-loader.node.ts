import { ASUtil, Imports, instantiate } from '@assemblyscript/loader';
import { readFileSync } from 'fs';
import { dirname, format, normalize } from 'path';

function getWasmModule(pathToModule: string) {
    return Promise.resolve(readFileSync(getPathRelativeToTheRunningScript(pathToModule)));
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
    return (await instantiate(module, imports)).exports as T & ASUtil;
}

export function getPathRelativeToTheRunningScript(relativePath: string) {
    let callerFunction = __filename;
    if (require.main && require.main.filename) {
        callerFunction = require.main.filename;
    } else {
        if (module.parent && module.parent.filename) {
            callerFunction = module.parent.filename;
        }
    }

    return format({
        root: '/',
        dir: dirname(callerFunction),
        base: normalize(relativePath),
    });
}
