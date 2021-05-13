import { ASUtil, Imports, instantiateSync } from '@assemblyscript/loader';

async function getWasmModule(pathToModule: string): Promise<any> {
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
