import { breakingChangesPatterns } from "../patterns/breaking-change.pattern";

export const hasBreakingChanges = (releaseNotes: string): boolean => {
    return breakingChangesPatterns.some(pattern => pattern.test(releaseNotes));
}
