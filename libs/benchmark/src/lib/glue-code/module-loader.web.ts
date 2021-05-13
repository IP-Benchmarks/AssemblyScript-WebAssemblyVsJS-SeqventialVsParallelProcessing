import { ASUtil, Imports, instantiate } from '@assemblyscript/loader';

async function getWasmModule(pathToModule: string): Promise<any> {
    const response = await fetch(pathToModule);
    return await response.arrayBuffer();
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
