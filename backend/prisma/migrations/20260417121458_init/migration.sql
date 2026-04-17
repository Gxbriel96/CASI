-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'EMPLEADO', 'SOCIO');

-- CreateEnum
CREATE TYPE "ResultadoCalidad" AS ENUM ('APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TipoCultivo" AS ENUM ('MAIZ', 'TRIGO', 'CEBADA');

-- CreateEnum
CREATE TYPE "EspecieFruta" AS ENUM ('MELOCOTON', 'NECTARINA', 'ALBARICOQUE', 'CIRUELA');

-- CreateEnum
CREATE TYPE "Calibre" AS ENUM ('AA', 'A', 'B', 'C');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'SOCIO',
    "socioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL,
    "numeroSocio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcela" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "hectareas" DOUBLE PRECISION NOT NULL,
    "ubicacion" TEXT,
    "coordenadas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parcela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cosecha" (
    "id" TEXT NOT NULL,
    "parcelaId" TEXT NOT NULL,
    "cultivo" "TipoCultivo" NOT NULL,
    "rendimiento" DOUBLE PRECISION,
    "fechaSiembra" TIMESTAMP(3),
    "fechaCosecha" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cosecha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Silo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "capacidad" DOUBLE PRECISION NOT NULL,
    "stockActual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cultivo" "TipoCultivo",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Silo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntradaAlmacen" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "cosechaId" TEXT,
    "siloId" TEXT,
    "peso" DOUBLE PRECISION NOT NULL,
    "humedad" DOUBLE PRECISION NOT NULL,
    "pesoEspecifico" DOUBLE PRECISION NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "impurezas" DOUBLE PRECISION NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntradaAlmacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlCalidad" (
    "id" TEXT NOT NULL,
    "entradaAlmacenId" TEXT NOT NULL,
    "humedad" DOUBLE PRECISION NOT NULL,
    "pesoEspecifico" DOUBLE PRECISION NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "impurezas" DOUBLE PRECISION NOT NULL,
    "resultado" "ResultadoCalidad" NOT NULL DEFAULT 'APROBADO',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlCalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrutaControl" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "especie" "EspecieFruta" NOT NULL,
    "variedad" TEXT,
    "calibre" "Calibre" NOT NULL,
    "azucar" DOUBLE PRECISION NOT NULL,
    "dureza" DOUBLE PRECISION NOT NULL,
    "defectos" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrutaControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liquidacion" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "cosechaId" TEXT,
    "totalKilos" DOUBLE PRECISION NOT NULL,
    "precioBase" DOUBLE PRECISION NOT NULL,
    "importeBruto" DOUBLE PRECISION NOT NULL,
    "apoyoGobierno" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "importeTotal" DOUBLE PRECISION NOT NULL,
    "fechaLiquidacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Liquidacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campana" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precioBaseMaiz" DOUBLE PRECISION NOT NULL,
    "precioBaseTrigo" DOUBLE PRECISION NOT NULL,
    "porcentajeApoyo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campana_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_socioId_key" ON "Usuario"("socioId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_numeroSocio_key" ON "Socio"("numeroSocio");

-- CreateIndex
CREATE INDEX "Parcela_socioId_idx" ON "Parcela"("socioId");

-- CreateIndex
CREATE INDEX "Cosecha_parcelaId_idx" ON "Cosecha"("parcelaId");

-- CreateIndex
CREATE UNIQUE INDEX "Silo_nombre_key" ON "Silo"("nombre");

-- CreateIndex
CREATE INDEX "EntradaAlmacen_socioId_idx" ON "EntradaAlmacen"("socioId");

-- CreateIndex
CREATE INDEX "EntradaAlmacen_siloId_idx" ON "EntradaAlmacen"("siloId");

-- CreateIndex
CREATE UNIQUE INDEX "ControlCalidad_entradaAlmacenId_key" ON "ControlCalidad"("entradaAlmacenId");

-- CreateIndex
CREATE INDEX "FrutaControl_socioId_idx" ON "FrutaControl"("socioId");

-- CreateIndex
CREATE INDEX "Liquidacion_socioId_idx" ON "Liquidacion"("socioId");

-- CreateIndex
CREATE UNIQUE INDEX "Campana_nombre_key" ON "Campana"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcela" ADD CONSTRAINT "Parcela_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cosecha" ADD CONSTRAINT "Cosecha_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "Parcela"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaAlmacen" ADD CONSTRAINT "EntradaAlmacen_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaAlmacen" ADD CONSTRAINT "EntradaAlmacen_cosechaId_fkey" FOREIGN KEY ("cosechaId") REFERENCES "Cosecha"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaAlmacen" ADD CONSTRAINT "EntradaAlmacen_siloId_fkey" FOREIGN KEY ("siloId") REFERENCES "Silo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlCalidad" ADD CONSTRAINT "ControlCalidad_entradaAlmacenId_fkey" FOREIGN KEY ("entradaAlmacenId") REFERENCES "EntradaAlmacen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrutaControl" ADD CONSTRAINT "FrutaControl_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidacion" ADD CONSTRAINT "Liquidacion_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidacion" ADD CONSTRAINT "Liquidacion_cosechaId_fkey" FOREIGN KEY ("cosechaId") REFERENCES "Cosecha"("id") ON DELETE SET NULL ON UPDATE CASCADE;
