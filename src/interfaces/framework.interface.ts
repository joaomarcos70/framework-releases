import { IBreakingChange } from "../types/Framework";

export interface IFramework {
    id: string;
    name: string;
    currentVersion: string;
    latestVersion: string;
    releaseDate: Date;
    repository: string;
    documentationUrl: string;
    breakingChanges: IBreakingChange;
    oldVersions: IBreakingChange[];
    updateId: number;
}

