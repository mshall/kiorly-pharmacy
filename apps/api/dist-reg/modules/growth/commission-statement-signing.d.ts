export declare const QUERY_SIGNATURE_HEADER = "X-Kiorly-Query-Signature";
export declare function canonicalQuery(query: string | URLSearchParams | undefined): string;
export declare function signStatementQuery(secret: string, i: {
    timestamp: string;
    nonce: string;
    method: string;
    path: string;
    query: string | URLSearchParams | undefined;
}): string;
export declare function statementSigningSecret(registered: string, env?: Record<string, string | undefined>): string;
