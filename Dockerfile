# 1. Imagen base
FROM node:20

# 2. Crear directorio de trabajo
WORKDIR /app

# 3. Copiar package.json e instalar dependencias
COPY server/package*.json ./server/
RUN cd server && npm install

# 4. Copiar el resto de los archivos
COPY server/ ./server/
COPY client/ ./client/
COPY .env .env

# 5. Establecer el puerto
EXPOSE 3000

# 6. Comando de inicio
CMD ["node", "server/index.js"]
