export interface Framework {
  name: string;
  currentVersion: string;
  latestVersion: string;
  releaseDate: Date;
  oldVersions: IBreakingChange[];
  breakingChanges: IBreakingChange;
  repository: string;
  documentationUrl: string;
  updateId: number;
}

export interface IBreakingChange {
  version: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  migrationGuide?: string;
  migrationContent?: string;
  updateId: number;
} 