import { StorageAdapter } from "./adapters/storage.adapter";
export declare class FilesController {
    private readonly storage;
    constructor(storage: StorageAdapter);
    download(key: string | undefined, exp: string | undefined, sig: string | undefined, res: {
        setHeader(n: string, v: string): void;
        end(b: Buffer): void;
    }): Promise<void>;
}
