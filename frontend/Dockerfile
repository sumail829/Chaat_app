FROM node:20-alpine AS builder
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD ["npx","expo","start"]
