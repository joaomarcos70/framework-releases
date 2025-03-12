import { IFramework } from "../interfaces/framework.interface";
import { FrameworkModel } from "../models/Framework";

export const getAllFrameworksRepository = async () => {
    try {
        const frameworks = await FrameworkModel.find().sort({ createdAt: -1 }).lean();
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
        const updateFields: any = { $set: {} };

        Object.entries(framework).forEach(([key, value]) => {
            if (key !== "oldVersions" && value !== undefined) {
                updateFields.$set[key] = value;
            }
        });

        if (framework.oldVersions?.length) {
            updateFields.$push = { oldVersions: { $each: framework.oldVersions } };
        }

        const response = await FrameworkModel.updateOne(
            { id: framework.id }, 
            updateFields
        );

        return response;
    } catch (error) {
        throw new Error(error as string);
    }
};


export const insertManyFrameworkRepository = async (frameworks: IFramework[]) => {
    try {
        const bulkOperations = frameworks.map(f => ({
            updateOne: {
                filter: { name: f.name },
                update: { $setOnInsert: f },
                upsert: true
            }
        }));

        const response = await FrameworkModel.bulkWrite(bulkOperations);

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
