export interface RecordedRequest {
    method: string;
    path: string;
    headers: Record<string, string | string[] | undefined>;
    body: any;
    raw: Buffer;
}
export interface FakeReply {
    status?: number;
    body?: unknown;
    delayMs?: number;
    headers?: Record<string, string>;
}
export interface FakeProvider {
    url: string;
    requests: RecordedRequest[];
    objects: Map<string, Buffer>;
    close(): Promise<void>;
}
export declare function startFakeProvider(override?: (r: RecordedRequest, n: number) => FakeReply | undefined, idPrefix?: string): Promise<FakeProvider>;
