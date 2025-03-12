"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManyFrameworkRepository = exports.insertManyFrameworkRepository = exports.updateFrameworkRepository = exports.getFrameworkByNameRepository = exports.getAllFrameworksRepository = void 0;
const Framework_1 = require("../models/Framework");
const getAllFrameworksRepository = async () => {
    try {
        const frameworks = await Framework_1.FrameworkModel.find().sort({ createdAt: -1 });
        return frameworks;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getAllFrameworksRepository = getAllFrameworksRepository;
const getFrameworkByNameRepository = async (name) => {
    try {
        const framework = await Framework_1.FrameworkModel.findOne({ name });
        return framework;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getFrameworkByNameRepository = getFrameworkByNameRepository;
const updateFrameworkRepository = async (framework) => {
    try {
        const updateFields = { $set: {} };
        Object.entries(framework).forEach(([key, value]) => {
            if (key !== "oldVersions" && value !== undefined) {
                updateFields.$set[key] = value;
            }
        });
        if (framework.oldVersions?.length) {
            updateFields.$push = { oldVersions: { $each: framework.oldVersions } };
        }
        await Framework_1.FrameworkModel.updateOne({ id: framework.id }, updateFields);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateFrameworkRepository = updateFrameworkRepository;
const insertManyFrameworkRepository = async (frameworks) => {
    try {
        const existingFrameworks = await Framework_1.FrameworkModel.find({
            id: { $in: frameworks.map(f => f.id) }
        });
        if (existingFrameworks.length > 0) {
            console.log("existingFrameworks", existingFrameworks);
            throw new Error(`Frameworks já existem: ${existingFrameworks.map(f => f.name).join(', ')}`);
        }
        if (frameworks.length === 0) {
            throw new Error('Frameworks não foram fornecidos');
        }
        const response = await Framework_1.FrameworkModel.insertMany(frameworks);
        console.log("response", response);
        return response;
    }
    catch (error) {
        throw new Error(error.message || 'Erro desconhecido ao inserir frameworks');
    }
};
exports.insertManyFrameworkRepository = insertManyFrameworkRepository;
const updateManyFrameworkRepository = async (frameworks) => {
    try {
        const bulkOps = frameworks.map(framework => ({
            updateOne: {
                filter: { id: framework.id },
                update: framework,
                upsert: true
            }
        }));
        const response = await Framework_1.FrameworkModel.bulkWrite(bulkOps);
        return response;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateManyFrameworkRepository = updateManyFrameworkRepository;
