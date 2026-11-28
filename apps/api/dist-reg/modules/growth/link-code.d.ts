export declare const LINK_CODE_PATTERN: RegExp;
export declare const LINK_CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export declare const LINK_CODE_LENGTH = 8;
export declare function generateLinkCode(random?: (n: number) => Buffer): string;
export declare function normalizeLinkCode(raw: unknown): string | null;
