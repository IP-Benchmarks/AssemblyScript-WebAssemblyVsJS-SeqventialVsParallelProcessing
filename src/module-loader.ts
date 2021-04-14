import loader, { Imports } from '@assemblyscript/loader';

async function getWasmModule(path: string): Promise<any> {
    if (!!require) {
        const fs = await import('fs');
        return fs.readFileSync(path);
    }
    return fetch(path);
}
export async function loadJsModule(path: string) {
    return await import(path);
}

export async function loadWasmModule(path: string, imports: Imports | undefined = {}) {
    const module = await getWasmModule(path);
    return await loader.instantiate(module, imports);
}
