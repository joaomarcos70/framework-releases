import axios from 'axios';
import { IApiReturns } from '../interfaces/apiReturns';
import { IFramework } from '../interfaces/framework.interface';
import dotenv from 'dotenv';
import {
    getAllFrameworksRepository,
    getFrameworkByNameRepository,
    insertManyFrameworkRepository,
    updateFrameworkRepository,
    updateManyFrameworkRepository
} from '../repository/frameworks.repository';
import { hasBreakingChanges } from '../shared/utils/breaking-change.utils';
import { IRepository } from '../models/all-frameworks';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const getAllFrameworksService = async (): Promise<IApiReturns> => {
    try {
        const frameworksFinded = await getAllFrameworksRepository();
        if (!frameworksFinded) {
            throw new Error('No frameworks found');
        }
        return {
            success: true,
            data: frameworksFinded,
            message: 'Frameworks found successfully'
        };
    } catch (error) {
        throw new Error(error as string);
    }
}

export const getFrameworkByNameService = async (name: string): Promise<IApiReturns> => {
    try {
        const framework = await getFrameworkByNameRepository(name);
        if (!framework) {
            throw new Error('Framework not found');
        }
        return {
            success: true,
            data: framework,
            message: 'Framework found successfully'
        };
    }
    catch (error) {
        throw new Error(error as string);
    }
}

export const updateFrameworkService = async (framework: IFramework): Promise<IApiReturns> => {
    try {

        const response = await updateFrameworkRepository(framework);

        if (!response) {
            throw new Error('Framework not updated');
        }

        return {
            success: true,
            data: null,
            message: 'Framework updated successfully'
        };
    }
    catch (error) {
        throw new Error(error as string);
    }
}

export const insertManyFrameworkService = async (frameworks: IFramework[]): Promise<IApiReturns> => {
    try {
        const frameworksInserted = await insertManyFrameworkRepository(frameworks);

        console.log("frameworksInserted", frameworksInserted);

        if (!frameworksInserted) {
            throw new Error('Frameworks not inserted');
        }
        return {
            success: true,
            data: frameworksInserted,
            message: 'Frameworks inserted successfully'
        };
    }
    catch (error) {
        throw new Error(error as string);
    }
}

export const updateManyFrameworkService = async (frameworks: IFramework[]): Promise<IApiReturns> => {
    try {
        const frameworksUpdated = await updateManyFrameworkRepository(frameworks);
        if (!frameworksUpdated) {
            throw new Error('Frameworks not updated');
        }
        return {
            success: true,
            data: frameworksUpdated,
            message: 'Frameworks updated successfully'
        };
    }
    catch (error) {
        throw new Error(error as string);
    }
}

export const checkForUpdatesService = async (): Promise<void> => {
    try {
        const frameworks = await getAllFrameworksRepository()
        const frameworksToUpdate: IFramework[] = [];

        if (!frameworks || frameworks.length === 0) {
            throw new Error('Nenhum framework encontrado para verificar atualizações');
        }
        //frameworks que já tenho cadastrados
        for (const [index, framework] of frameworks.entries()) {
            try {
                const updates = await axios.get(
                    `https://api.github.com/repos/${framework.repository}/releases`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!updates?.data || updates?.data.length === 0) {
                    console.warn(`⚠️ Nenhum release encontrado para ${framework.name}`);
                    continue;
                }

                updates.data.forEach(async (update: { tag_name: string; body: string; html_url: string; id: number }, index: number) => {
                    const latestVersion = update?.tag_name;
                    const releaseNotes = update?.body || 'No release notes found';
                    const description = releaseNotes.length > 100 ? releaseNotes.substring(0, 100) + '...' : releaseNotes;

                    if (index === 0) {
                        framework.latestVersion = latestVersion;
                        framework.breakingChanges = {
                            version: latestVersion,
                            description: description,
                            impact: hasBreakingChanges(releaseNotes) ? 'HIGH' : 'LOW',
                            migrationGuide: update?.html_url,
                            migrationContent: releaseNotes,
                            updateId: update?.id
                        }
                    }

                    if (index !== 0) {
                        framework.oldVersions.push({
                            version: latestVersion,
                            description: description,
                            impact: hasBreakingChanges(releaseNotes) ? 'HIGH' : 'LOW',
                            migrationGuide: update?.html_url,
                            migrationContent: releaseNotes,
                            updateId: update?.id
                        })
                    }
                    return framework;
                })
                
                frameworksToUpdate.push(framework as unknown as IFramework);

            } catch (error: any) {
                console.error(`❌ Erro ao verificar atualizações do framework ${framework.name}:`, error.response.data);
            }
        }
        const response = await updateManyFrameworkService(frameworksToUpdate);
        if (!response) {
            throw new Error('Frameworks not updated');
        }
        return;
    } catch (error) {
        console.error('❌ Erro ao executar checkForUpdatesService:', error);
        throw error;
    }
};
export const remapRepositoryToFramework = (repository: IRepository[]): IFramework[] => {
    const frameworks: IFramework[] = [];
    repository.map((repo) => {
        frameworks.push({
            id: uuidv4(),
            name: repo.name,
            repository: repo.repository,
            documentationUrl: repo.documentationUrl,
            updateId: 0,
            currentVersion: '',
            latestVersion: '',
            releaseDate: new Date(),
            breakingChanges: {
                version: '',
                description: '',
                impact: 'LOW',
                migrationGuide: '',
                migrationContent: '',
                updateId: 0
            },
            oldVersions: []
        })
    })
    return frameworks;
}


