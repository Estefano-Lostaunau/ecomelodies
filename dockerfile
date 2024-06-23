# Etapa 1: Construcci贸n
FROM node:16-alpine AS build

# Configuraci贸n del directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicaci贸n
COPY . .

# Exponer puerto
EXPOSE 6969

# Comando por defecto para ejecutar la aplicaci贸n
CMD ["npm", "start"]
