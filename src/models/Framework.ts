import mongoose, { Schema } from 'mongoose';
import { Framework } from '../types/Framework';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const breakingChangeSchema = new Schema({
  version: { type: String, required: true },
  description: { type: String, required: true },
  impact: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  migrationGuide: { type: String }
});

const frameworkSchema = new Schema({
  name: { type: String, required: true, unique: true },
  currentVersion: { type: String, required: true },
  latestVersion: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  breakingChanges: [breakingChangeSchema],
  repository: { type: String, required: true },
  documentationUrl: { type: String, required: true }
}, {
  timestamps: true
});

export const FrameworkModel = mongoose.model<Framework>('Framework', frameworkSchema); 