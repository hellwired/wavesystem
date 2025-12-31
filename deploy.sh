#!/bin/bash

# Define project directory (Directory where this script is located)
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "==========================================="
echo "   WaveSystem Next - Deployment Script"
echo "==========================================="
echo "📅 $(date)"
echo "📂 Directorio: $PROJECT_DIR"

# Set Timezone
export TZ='America/Argentina/Buenos_Aires'
echo "🕒 Zona Horaria configurada: $TZ"

# Navigate to project directory
cd "$PROJECT_DIR" || { echo "❌ Error: No se pudo entrar al directorio"; exit 1; }

# 1. Kill any lingering Next.js build processes (optional safety)
# pkill -f "next build" 2>/dev/null

# 2. Stop PM2 to free up resources
echo "🛑 Deteniendo procesos PM2..."
pm2 stop all

# 3. Clean cache (Optional: helps if build is stuck)
echo "🧹 Limpiando caché (.next)..."
rm -rf .next
rm -rf node_modules/.cache

# 4. Install dependencies (Quick check)
echo "📦 Verificando dependencias..."
npm install --no-audit --prefer-offline


# 5. Build
echo "🏗️  Construyendo la aplicación (npm run build)..."
# Increase memory limit for node to avoid crashes during build
export NODE_OPTIONS="--max-old-space-size=4096"

if npm run build; then
    echo "✅ Build exitoso."
else
    echo "❌ Error en el Build. Abortando."
    exit 1
fi

# 6. Restart PM2
echo "🚀 Reiniciando PM2..."
pm2 restart all --update-env

echo "==========================================="
echo "✅  DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "==========================================="
