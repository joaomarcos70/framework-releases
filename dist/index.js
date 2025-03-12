"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const frameworkRoutes_1 = __importDefault(require("./routes/frameworkRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/framework-releases';
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', frameworkRoutes_1.default);
//updateFrameworksJob();
// Conexão com MongoDB
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
});
