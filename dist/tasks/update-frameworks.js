"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const frameworks_service_1 = require("../services/frameworks.service");
const node_cron_1 = __importDefault(require("node-cron"));
const updateFrameworksJob = () => {
    console.log('⏳ Iniciando cron jobs...');
    node_cron_1.default.schedule('*/5 * * * *', async () => {
        console.log('🔍 Verificando atualizações de frameworks...');
        try {
            await (0, frameworks_service_1.checkForUpdatesService)();
            console.log('✅ Atualização concluída com sucesso.');
        }
        catch (error) {
            console.error('❌ Erro ao verificar atualizações:', error);
        }
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
};
exports.default = updateFrameworksJob;
