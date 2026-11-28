export declare function hashPassword(pw: string): Promise<string>;
export declare function verifyPassword(pw: string, stored: string | null | undefined): Promise<boolean>;
