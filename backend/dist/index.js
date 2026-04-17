"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
async function seed() {
    try {
        const hashedPassword = await bcrypt_1.default.hash("admin123", 10);
        await database_1.default.usuario.upsert({
            where: { email: "admin@casi.es" },
            update: {},
            create: {
                email: "admin@casi.es",
                password: hashedPassword,
                rol: "ADMIN",
                nombre: "Administrador",
            },
        });
        console.log("✅ Usuario admin creado: admin@casi.es / admin123");
    }
    catch (error) {
        console.log("ℹ️ Usuario admin ya existe o error en seed");
    }
}
if (process.env.NODE_ENV !== "production") {
    seed().finally(() => {
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor CASI corriendo en http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
            console.log(`🔑 Login: admin@casi.es / admin123`);
        });
    });
}
else {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Servidor CASI corriendo en http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map