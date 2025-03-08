export interface IFramework {
    id: string;
    name: string;
    currentVersion: string;
    latestVersion: string;
    releaseDate: Date;
    repository: string;
    documentationUrl: string;
    breakingChanges: any[];
}

