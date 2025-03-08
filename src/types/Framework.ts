export interface Framework {
  name: string;
  currentVersion: string;
  latestVersion: string;
  releaseDate: Date;
  breakingChanges: BreakingChange[];
  repository: string;
  documentationUrl: string;
}

export interface BreakingChange {
  version: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  migrationGuide?: string;
  migrationContent?: string;
} 