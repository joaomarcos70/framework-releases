import { IFramework } from "../interfaces/framework.interface";
import { FrameworkModel } from "../models/Framework";

export const getAllFrameworksRepository = async () => {
    try {
        const frameworks = await FrameworkModel.find().sort({ createdAt: -1 });
        return frameworks;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const getFrameworkByNameRepository = async (name: string) => {
    try {
        const framework = await FrameworkModel.findOne({ name });
        return framework;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const updateFrameworkRepository = async (framework: IFramework) => {
    try {
        const frameworkUpdated = await FrameworkModel.findOneAndUpdate({ id: framework.id }, framework, { new: true });
        return frameworkUpdated;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const insertManyFrameworkRepository = async (frameworks: IFramework[]) => {
    try {
        const existingFrameworks = await FrameworkModel.find({
            id: { $in: frameworks.map(f => f.id) }
        });

        if (existingFrameworks.length > 0) {
            throw new Error(`Frameworks já existem: ${existingFrameworks.map(f => f.name).join(', ')}`);
        }

        const response = await FrameworkModel.insertMany(frameworks);
        return response;
    } catch (error) {
        throw new Error((error as Error).message || 'Erro desconhecido ao inserir frameworks');
    }
};

export const updateManyFrameworkRepository = async (frameworks: IFramework[]) => {
    try {
        const bulkOps = frameworks.map(framework => ({
            updateOne: {
                filter: { id: framework.id },
                update: framework,
                upsert: true
            }
        }));
        const response = await FrameworkModel.bulkWrite(bulkOps);
        return response;
    } catch (error) {
        throw new Error(error as string);
    }
}
