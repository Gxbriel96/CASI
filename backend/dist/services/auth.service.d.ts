export declare class AuthService {
    login(email: string, password: string): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            rol: import(".prisma/client").$Enums.Rol;
            socio: {
                id: string;
                numeroSocio: string;
                nombre: string;
            } | null;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        token: string;
    }>;
    me(userId: string): Promise<{
        id: string;
        email: string;
        rol: import(".prisma/client").$Enums.Rol;
        socio: {
            id: string;
            numeroSocio: string;
            nombre: string;
        } | null;
    }>;
    register(email: string, password: string, nombre: string, rol?: "ADMIN" | "EMPLEADO" | "SOCIO", socioId?: string): Promise<{
        id: string;
        email: string;
        rol: import(".prisma/client").$Enums.Rol;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map