"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBreakingChanges = void 0;
const breaking_change_pattern_1 = require("../patterns/breaking-change.pattern");
const hasBreakingChanges = (releaseNotes) => {
    return breaking_change_pattern_1.breakingChangesPatterns.some(pattern => pattern.test(releaseNotes));
};
exports.hasBreakingChanges = hasBreakingChanges;
