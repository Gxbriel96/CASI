#!/bin/bash

echo "=========================================="
echo "  Setup Backend - CASI"
echo "=========================================="

echo ""
echo "1. Instalando dependencias..."
npm install

echo ""
echo "2. Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "   Docker encontrado"
    if command -v docker compose &> /dev/null; then
        echo "   Iniciando PostgreSQL..."
        docker compose up -d
    else
        echo "   Iniciando con docker-compose..."
        docker-compose up -d
    fi
else
    echo "   ⚠️ Docker no encontrado. Asegúrate de tener PostgreSQL instalado localmente."
fi

echo ""
echo "3. Ejecutando migraciones de Prisma..."
npx prisma migrate dev --name init

echo ""
echo "4. Generando cliente Prisma..."
npx prisma generate

echo ""
echo "5. Ejecutando tests..."
npm test

echo ""
echo "=========================================="
echo "  Setup completado!"
echo "=========================================="
echo ""
echo "Para iniciar el servidor:"
echo "  npm run dev"
echo ""
echo "Adminer (gestor BD): http://localhost:8080"
echo "=========================================="