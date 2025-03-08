import { checkForUpdatesService } from '../services/frameworks.service';
import cron from 'node-cron';

const updateFrameworksJob = () => {
    console.log('⏳ Iniciando cron jobs...');

cron.schedule('*/5 * * * *', async () => {
    console.log('🔍 Verificando atualizações de frameworks...');
    try {
        await checkForUpdatesService();
        console.log('✅ Atualização concluída com sucesso.');
    } catch (error) {
        console.error('❌ Erro ao verificar atualizações:', error);
    }
}, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });
}

export default updateFrameworksJob;