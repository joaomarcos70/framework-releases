"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remapRepositoryToFramework = exports.checkForUpdatesService = exports.updateManyFrameworkService = exports.insertManyFrameworkService = exports.updateFrameworkService = exports.getFrameworkByNameService = exports.getAllFrameworksService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const frameworks_repository_1 = require("../repository/frameworks.repository");
const breaking_change_utils_1 = require("../shared/utils/breaking-change.utils");
const uuid_1 = require("uuid");
dotenv_1.default.config();
const getAllFrameworksService = async () => {
    try {
        const frameworksFinded = await (0, frameworks_repository_1.getAllFrameworksRepository)();
        if (!frameworksFinded) {
            throw new Error('No frameworks found');
        }
        return {
            success: true,
            data: frameworksFinded,
            message: 'Frameworks found successfully'
        };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getAllFrameworksService = getAllFrameworksService;
const getFrameworkByNameService = async (name) => {
    try {
        const framework = await (0, frameworks_repository_1.getFrameworkByNameRepository)(name);
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
        throw new Error(error);
    }
};
exports.getFrameworkByNameService = getFrameworkByNameService;
const updateFrameworkService = async (framework) => {
    try {
        return {
            success: true,
            data: null,
            message: 'Framework updated successfully'
        };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateFrameworkService = updateFrameworkService;
const insertManyFrameworkService = async (frameworks) => {
    try {
        const frameworksInserted = await (0, frameworks_repository_1.insertManyFrameworkRepository)(frameworks);
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
        throw new Error(error);
    }
};
exports.insertManyFrameworkService = insertManyFrameworkService;
const updateManyFrameworkService = async (frameworks) => {
    try {
        const frameworksUpdated = await (0, frameworks_repository_1.updateManyFrameworkRepository)(frameworks);
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
        throw new Error(error);
    }
};
exports.updateManyFrameworkService = updateManyFrameworkService;
const checkForUpdatesService = async () => {
    try {
        const frameworks = await (0, frameworks_repository_1.getAllFrameworksRepository)();
        if (!frameworks || frameworks.length === 0) {
            throw new Error('Nenhum framework encontrado para verificar atualizações');
        }
        for (const [index, framework] of frameworks.entries()) {
            try {
                const updates = await axios_1.default.get(`https://api.github.com/repos/${framework.repository}/releases`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (!updates.data || updates.data.length === 0) {
                    console.warn(`⚠️ Nenhum release encontrado para ${framework.name}`);
                    continue;
                }
                const latestVersion = updates.data[0].tag_name;
                const releaseNotes = updates.data[0].body || 'No release notes found';
                const description = releaseNotes.length > 100 ? releaseNotes.substring(0, 100) + '...' : releaseNotes;
                if (latestVersion !== framework.latestVersion) {
                    if ((0, breaking_change_utils_1.hasBreakingChanges)(releaseNotes)) {
                        framework.breakingChanges = {
                            version: latestVersion,
                            description: description,
                            impact: 'HIGH',
                            migrationGuide: updates.data[0].html_url,
                            migrationContent: releaseNotes,
                            updateId: updates.data[0].id
                        };
                    }
                    framework.latestVersion = latestVersion;
                    framework.releaseDate = new Date(updates.data[0].published_at);
                    if (index !== 0) {
                        framework.oldVersions.push({
                            version: updates.data[index].tag_name,
                            description: updates.data[index].body || 'No release notes found',
                            impact: (0, breaking_change_utils_1.hasBreakingChanges)(updates.data[index].body) ? 'HIGH' : 'LOW',
                            migrationGuide: updates.data[index].html_url,
                            migrationContent: updates.data[index].body || 'No release content found',
                            updateId: updates.data[index].id
                        });
                    }
                    await (0, exports.updateFrameworkService)(framework.toObject());
                    console.log(`✅ ${framework.name} atualizado para versão ${latestVersion}`);
                }
            }
            catch (error) {
                console.error(`❌ Erro ao verificar atualizações do framework ${framework.name}:`, error.response.data);
            }
        }
    }
    catch (error) {
        console.error('❌ Erro ao executar checkForUpdatesService:', error);
    }
};
exports.checkForUpdatesService = checkForUpdatesService;
const remapRepositoryToFramework = (repository) => {
    const frameworks = [];
    repository.map((repo) => {
        frameworks.push({
            id: (0, uuid_1.v4)(),
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
        });
    });
    return frameworks;
};
exports.remapRepositoryToFramework = remapRepositoryToFramework;
