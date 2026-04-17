import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/database";
import { UnauthorizedError, NotFoundError } from "../utils/errors";

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

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { userId: usuario.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
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
        process.env.JWT_REFRESH_SECRET!
      ) as { userId: string };

      const usuario = await prisma.usuario.findUnique({
        where: { id: payload.userId },
      });

      if (!usuario) {
        throw new UnauthorizedError("Usuario no encontrado");
      }

      const newToken = jwt.sign(
        { userId: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
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