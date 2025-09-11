# Stage 1: Build the client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Setup the server
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

# Copy the built client from the client-builder stage
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 3001

CMD ["npm", "start"]
