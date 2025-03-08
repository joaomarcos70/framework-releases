import mongoose, { Schema } from 'mongoose';
import { Framework } from '../types/Framework';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const breakingChangeSchema = new Schema({
  version: { type: String, required: true },
  description: { type: String, required: true },
  impact: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  migrationGuide: { type: String },
  migrationContent: { type: String }
});

const frameworkSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  name: { type: String, required: true, unique: true },
  currentVersion: { type: String, required: true },
  latestVersion: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  breakingChanges: [breakingChangeSchema],
  repository: { type: String, required: true },
  documentationUrl: { type: String, required: true },
}, {
  timestamps: true
});

export const FrameworkModel = mongoose.model<Framework>('Framework', frameworkSchema); 