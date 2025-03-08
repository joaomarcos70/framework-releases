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
        const frameworkUpdated = await updateFrameworkRepository(framework);
        if (!frameworkUpdated) {
            throw new Error('Framework not found');
        }
        return {
            success: true,
            data: frameworkUpdated,
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
        const frameworks = await getAllFrameworksRepository();
        if (!frameworks || frameworks.length === 0) {
            throw new Error('Nenhum framework encontrado para verificar atualizações');
        }

        for (const framework of frameworks) {
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
                const releaseNotes = response.data.body || 'No release notes found';
                const description = releaseNotes.length > 100 ? releaseNotes.substring(0, 100) + '...' : releaseNotes;

                if (latestVersion !== framework.latestVersion) {
                    const hasBreakingChanges = releaseNotes.toLowerCase().includes('breaking change') ||
                        releaseNotes.toLowerCase().includes('breaking changes');

                    if (hasBreakingChanges) {
                        framework.breakingChanges.push({
                            version: latestVersion,
                            description: description,
                            impact: hasBreakingChanges ? 'HIGH' : 'MEDIUM',
                            migrationGuide: response.data.html_url,
                            migrationContent: releaseNotes
                        });
                    }

                    framework.latestVersion = latestVersion;
                    framework.releaseDate = new Date(response.data.published_at);
                    await updateFrameworkService({
                        ...framework,
                        currentVersion: latestVersion
                    } as IFramework);   

                    console.log(`✅ ${framework.name} atualizado para versão ${latestVersion}`);
                }
            } catch (error:any) {
                console.error(`❌ Erro ao verificar atualizações do framework ${framework.name}:`, error.response.data);
            }
        }
    } catch (error) {
        console.error('❌ Erro ao executar checkForUpdatesService:', error);
    }
};


