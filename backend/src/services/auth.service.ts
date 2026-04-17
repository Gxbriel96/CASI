import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/database";
import { UnauthorizedError, NotFoundError } from "../utils/errors";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "default-secret";
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "default-refresh-secret";

export class AuthService {
  async login(email: string, password: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { socio: true },
    });

    if (!usuario) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const isValid = await bcrypt.compare(password, usuario.password);

    if (!isValid) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const payload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      socioId: usuario.socioId,
    };

    const signOptions: SignOptions = { expiresIn: "15m" };
    const token = jwt.sign(payload, JWT_SECRET, signOptions);

    const refreshOptions: SignOptions = { expiresIn: "7d" };
    const refreshToken = jwt.sign(
      { userId: usuario.id },
      JWT_REFRESH_SECRET,
      refreshOptions
    );

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

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET
      ) as { userId: string };

      const usuario = await prisma.usuario.findUnique({
        where: { id: payload.userId },
      });

      if (!usuario) {
        throw new UnauthorizedError("Usuario no encontrado");
      }

      const signOptions: SignOptions = { expiresIn: "15m" };
      const newToken = jwt.sign(
        { userId: usuario.id, email: usuario.email, rol: usuario.rol },
        JWT_SECRET,
        signOptions
      );

      return { token: newToken };
    } catch {
      throw new UnauthorizedError("Refresh token inválido");
    }
  }

  async me(userId: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { socio: true },
    });

    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
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

  async register(email: string, password: string, nombre: string, rol: "ADMIN" | "EMPLEADO" | "SOCIO" = "SOCIO", socioId?: string) {
    const existing = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
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

export const authService = new AuthService();