import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { mainFrameworks } from '../models/all-frameworks';
import { checkForUpdatesService, getAllFrameworksService, getFrameworkByNameService, insertManyFrameworkService, updateFrameworkService, updateManyFrameworkService } from '../services/frameworks.service';
import { IFramework } from '../interfaces/framework.interface';

dotenv.config();

export const getAllFrameworks = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await getAllFrameworksService();

    if (!response.success) {
      res.status(404).json(response);
    }

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar frameworks', error });
  }
}

export const getFrameworkByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    if (!name) {
      res.status(400).json({ message: 'Nome do framework não informado' });
      return;
    }
    const response = await getFrameworkByNameService(name);

    if (!response.success) {
      res.status(404).json(response);
      return;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar framework', error });
  }
}

export const updateFramework = async (req: Request, res: Response): Promise<void> => {
  try {
    const framework = req.body;
    const response = await updateFrameworkService(framework);

    if (!response.success) {
      res.status(404).json(response);
      return;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar framework', error });
  }
}

export const updateManyFrameworks = async (req: Request, res: Response): Promise<void> => {
  try {
    const frameworks = req.body.frameworks as IFramework[];
    const response = await updateManyFrameworkService(frameworks);
    if (!response.success) {
      res.status(404).json(response);
      return;
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar frameworks', error });
  }
}

export const insertFrameworks = async (req: Request, res: Response): Promise<void> => {
  try {
    const frameworksToInsert = (req.body.frameworks as IFramework[]) || mainFrameworks;

    const response = await insertManyFrameworkService(frameworksToInsert);
    if (!response.success) {
      res.status(404).json(response);
      return;
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao inserir frameworks', error });
  }
}

export const checkForUpdates = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await checkForUpdatesService();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar atualizações', error });
  }
}

