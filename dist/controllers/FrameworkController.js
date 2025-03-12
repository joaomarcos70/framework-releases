"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUpdates = exports.insertFrameworks = exports.updateManyFrameworks = exports.updateFramework = exports.getFrameworkByName = exports.getAllFrameworks = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const frameworks_service_1 = require("../services/frameworks.service");
const all_frameworks_1 = require("../models/all-frameworks");
dotenv_1.default.config();
const getAllFrameworks = async (req, res) => {
    try {
        const response = await (0, frameworks_service_1.getAllFrameworksService)();
        if (!response.success) {
            res.status(404).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar frameworks', error });
    }
};
exports.getAllFrameworks = getAllFrameworks;
const getFrameworkByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (!name) {
            res.status(400).json({ message: 'Nome do framework não informado' });
            return;
        }
        const response = await (0, frameworks_service_1.getFrameworkByNameService)(name);
        if (!response.success) {
            res.status(404).json(response);
            return;
        }
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar framework', error });
    }
};
exports.getFrameworkByName = getFrameworkByName;
const updateFramework = async (req, res) => {
    try {
        const framework = req.body;
        const response = await (0, frameworks_service_1.updateFrameworkService)(framework);
        if (!response.success) {
            res.status(404).json(response);
            return;
        }
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar framework', error });
    }
};
exports.updateFramework = updateFramework;
const updateManyFrameworks = async (req, res) => {
    try {
        const frameworks = req.body.frameworks;
        const response = await (0, frameworks_service_1.updateManyFrameworkService)(frameworks);
        if (!response.success) {
            res.status(404).json(response);
            return;
        }
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar frameworks', error });
    }
};
exports.updateManyFrameworks = updateManyFrameworks;
const insertFrameworks = async (req, res) => {
    try {
        const frameworksToInsert = req.body.listRepositories || all_frameworks_1.listRepositories;
        const response = await (0, frameworks_service_1.insertManyFrameworkService)((0, frameworks_service_1.remapRepositoryToFramework)(frameworksToInsert));
        if (!response.success) {
            res.status(404).json(response);
            return;
        }
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao inserir frameworks', error });
    }
};
exports.insertFrameworks = insertFrameworks;
const checkForUpdates = async (req, res) => {
    try {
        const response = await (0, frameworks_service_1.checkForUpdatesService)();
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao verificar atualizações', error });
    }
};
exports.checkForUpdates = checkForUpdates;
