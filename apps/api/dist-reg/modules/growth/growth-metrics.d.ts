export interface KiorexOrderCounts {
    total: number;
    completed: number;
    rejectedOrCancelled: number;
}
export interface LinkCountTotals {
    visits: number;
    orders: number;
    completed: number;
}
export declare function buildPerformance(kiorex: KiorexOrderCounts, links: LinkCountTotals): {
    providerOriginated: {
        orders: number;
        completed: number;
        completionRate: number | null;
    };
    marketplaceOriginated: {
        orders: number;
        completed: number;
        completionRate: number | null;
    };
    links: {
        visits: number;
        orders: number;
        completed: number;
        visitToOrder: number | null;
        orderToCompleted: number | null;
    };
    kiorex: {
        orders: number;
        completed: number;
        rejectedOrCancelled: number;
    };
    acquisitionPending: boolean;
};
