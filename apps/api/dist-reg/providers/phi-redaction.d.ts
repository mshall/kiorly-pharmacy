export interface Redaction {
    text: string;
    counts: Record<string, number>;
    total: number;
}
export declare function redactPhi(input: string, names?: string[]): Redaction;
