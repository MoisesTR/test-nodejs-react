# Development Dockerfile - Prisma compatible
FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files first (for better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client during build
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3001

# Start with development command
CMD ["npm", "run", "dev"]