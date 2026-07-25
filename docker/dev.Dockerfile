FROM node:20-alpine

WORKDIR /app

# Install system dependencies needed for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev"]
