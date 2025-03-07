import { Request, Response } from 'express';
import { FrameworkModel } from '../models/Framework';
import axios from 'axios';

export class FrameworkController {
  public async getAllFrameworks(req: Request, res: Response): Promise<void> {
    try {
      const frameworks = await FrameworkModel.find();
      res.json(frameworks);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar frameworks', error });
    }
  }

  public async getFrameworkByName(req: Request, res: Response): Promise<void> {
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

  public async addFramework(req: Request, res: Response): Promise<void> {
    try {
      const newFramework = new FrameworkModel(req.body);
      await newFramework.save();
      res.status(201).json(newFramework);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar framework', error });
    }
  }

  public async updateFramework(req: Request, res: Response): Promise<void> {
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

  public async checkForUpdates(req: Request, res: Response): Promise<void> {
    try {
      const frameworks = await FrameworkModel.find();
      const updates = await Promise.all(
        frameworks.map(async (framework) => {
          try {
            // Exemplo usando GitHub API - você precisará adaptar para cada framework
            const response = await axios.get(`https://api.github.com/repos/${framework.repository}/releases/latest`);
            const latestVersion = response.data.tag_name;
            
            if (latestVersion !== framework.latestVersion) {
              framework.latestVersion = latestVersion;
              framework.releaseDate = new Date(response.data.published_at);
              await framework.save();
              return {
                name: framework.name,
                updated: true,
                newVersion: latestVersion
              };
            }
            return {
              name: framework.name,
              updated: false
            };
          } catch (error) {
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
      res.status(500).json({ message: 'Erro ao verificar atualizações', error });
    }
  }
} 