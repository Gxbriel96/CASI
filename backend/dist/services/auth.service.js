"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default-refresh-secret";
class AuthService {
    async login(email, password) {
        const usuario = await database_1.default.usuario.findUnique({
            where: { email },
            include: { socio: true },
        });
        if (!usuario) {
            throw new errors_1.UnauthorizedError("Credenciales inválidas");
        }
        const isValid = await bcrypt_1.default.compare(password, usuario.password);
        if (!isValid) {
            throw new errors_1.UnauthorizedError("Credenciales inválidas");
        }
        const payload = {
            userId: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
            socioId: usuario.socioId,
        };
        const signOptions = { expiresIn: "15m" };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, signOptions);
        const refreshOptions = { expiresIn: "7d" };
        const refreshToken = jsonwebtoken_1.default.sign({ userId: usuario.id }, JWT_REFRESH_SECRET, refreshOptions);
        return {
            token,
            refreshToken,
            user: {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
                socio: usuario.socio ? {
                    id: usuario.socio.id,
                    numeroSocio: usuario.socio.numeroSocio,
                    nombre: usuario.socio.nombre,
                } : null,
            },
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
            const usuario = await database_1.default.usuario.findUnique({
                where: { id: payload.userId },
            });
            if (!usuario) {
                throw new errors_1.UnauthorizedError("Usuario no encontrado");
            }
            const signOptions = { expiresIn: "15m" };
            const newToken = jsonwebtoken_1.default.sign({ userId: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, signOptions);
            return { token: newToken };
        }
        catch {
            throw new errors_1.UnauthorizedError("Refresh token inválido");
        }
    }
    async me(userId) {
        const usuario = await database_1.default.usuario.findUnique({
            where: { id: userId },
            include: { socio: true },
        });
        if (!usuario) {
            throw new errors_1.NotFoundError("Usuario no encontrado");
        }
        return {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
            socio: usuario.socio ? {
                id: usuario.socio.id,
                numeroSocio: usuario.socio.numeroSocio,
                nombre: usuario.socio.nombre,
            } : null,
        };
    }
    async register(email, password, nombre, rol = "SOCIO", socioId) {
        const existing = await database_1.default.usuario.findUnique({
            where: { email },
        });
        if (existing) {
            throw new Error("El email ya está registrado");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const usuario = await database_1.default.usuario.create({
            data: {
                email,
                password: hashedPassword,
                nombre,
                rol,
                ...(socioId && { socioId }),
            },
        });
        return {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
        };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map