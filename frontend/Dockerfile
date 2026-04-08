FROM node:22-alpine

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source
COPY . .

EXPOSE 5173
