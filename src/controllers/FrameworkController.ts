import { Request, Response } from 'express';
import { FrameworkModel } from '../models/Framework';
import axios from 'axios';
import dotenv from 'dotenv';
import { mainFrameworks } from '../models/AllFrameworks';

dotenv.config();

  export const getAllFrameworks = async (req: Request, res: Response): Promise<void> => {
    try {
      const frameworks = await FrameworkModel.find();
      res.json(frameworks);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar frameworks', error });
    }
  }

  export const getFrameworkByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const framework = await FrameworkModel.findOne({ name: req.params.name });
      if (!framework) {
        res.status(404).json({ message: 'Framework não encontrado' });
        return;
      }
      res.json(framework);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar framework', error });
    }
  }

  export const addFramework = async (req: Request, res: Response): Promise<void> => {
    try {
      const newFramework = new FrameworkModel(req.body);
      await newFramework.save();
      res.status(201).json(newFramework);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar framework', error });
    }
  }

  export const updateFramework = async (req: Request, res: Response): Promise<void> => {
    try {
      const framework = await FrameworkModel.findOneAndUpdate(
        { name: req.params.name },
        req.body,
        { new: true }
      );
      if (!framework) {
        res.status(404).json({ message: 'Framework não encontrado' });
        return;
      }
      res.json(framework);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar framework', error });
    }
  }

  export const insertFrameworks = async (req: Request, res: Response): Promise<void> => {
    try {
      const frameworks = await FrameworkModel.insertMany(mainFrameworks);
      res.json({ message: 'Frameworks inseridos com sucesso', frameworks });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao inserir frameworks', error });
    }
  }

  export const checkForUpdates = async (req: Request, res: Response): Promise<void> => {
    try {
      const frameworks = await FrameworkModel.find();
      const updates = await Promise.all(
        frameworks.map(async (framework) => {
          try {
            const response = await axios.get(
              `https://api.github.com/repos/${framework.repository}/releases/latest`,
              {
                headers: {
                  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              }
            );
            
            const latestVersion = response.data.tag_name;
            const releaseNotes = response.data.body || '';
            
            if (latestVersion !== framework.latestVersion) {
              const hasBreakingChanges = releaseNotes.toLowerCase().includes('breaking change') ||
                                       releaseNotes.toLowerCase().includes('breaking changes');
              
              if (hasBreakingChanges) {
                framework.breakingChanges.push({
                  version: latestVersion,
                  description: 'Possíveis breaking changes detectados - verifique as release notes',
                  impact: 'MEDIUM',
                  migrationGuide: response.data.html_url
                });
              }
              
              framework.latestVersion = latestVersion;
              framework.releaseDate = new Date(response.data.published_at);
              await framework.save();
              
              return {
                name: framework.name,
                updated: true,
                newVersion: latestVersion,
                hasBreakingChanges,
                releaseUrl: response.data.html_url
              };
            }
            
            return {
              name: framework.name,
              updated: false
            };
          } catch (error) {
            console.error(`Erro ao verificar atualizações para ${framework.name}:`, error);
            return {
              name: framework.name,
              updated: false,
              error: 'Erro ao verificar atualizações'
            };
          }
        })
      );
      res.json(updates);
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
      res.status(500).json({ message: 'Erro ao verificar atualizações', error });
    }
  }
