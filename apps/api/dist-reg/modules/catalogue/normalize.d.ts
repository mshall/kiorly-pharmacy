export declare const normIngredient: (s: string) => string;
export declare const normStrength: (s: string) => string;
export declare const normForm: (s: string) => string;
export declare function groupKey(d: {
    activeIngredient: string;
    strength: string;
    dosageForm: string;
}): {
    activeIngredient: string;
    strength: string;
    dosageForm: string;
};
