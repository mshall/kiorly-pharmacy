export declare const MAX_DISMISSED = 50;
export declare function sanitizeDismissed(input: unknown): string[];
export declare const isValidDismissedBody: (b: unknown) => b is {
    keys: unknown[];
};
