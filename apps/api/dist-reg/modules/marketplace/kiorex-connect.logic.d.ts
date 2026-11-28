import type { ConnectStatus, ConnectStep } from "./kiorex-connect.core";
export interface PharmacyConnectFacts {
    status: ConnectStatus;
    subscriptionStatus: string;
    optedInBranches: number;
    pricedItems: number;
    branchesMissingHours: number;
    branchesMissingLicenceNo: number;
    licenceDocument: boolean;
    payoutLabel: boolean;
    termsAccepted: boolean;
    liveOnKiorex: boolean;
}
export declare function computePharmacySteps(f: PharmacyConnectFacts): ConnectStep[];
