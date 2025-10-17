# Development Dockerfile - Simple setup
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (npm install for development)
RUN npm install

# Expose port
EXPOSE 3001

# Start with development command
CMD ["npm", "run", "dev"]