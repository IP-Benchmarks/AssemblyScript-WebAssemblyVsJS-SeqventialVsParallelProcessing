import loader, { Imports } from '@assemblyscript/loader';

async function getWasmModule(pathToModule: string): Promise<any> {
    return fetch(pathToModule);
}

export async function loadJsModule<T = Record<string, unknown>>(pathToModule: string) {
    patch();

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
