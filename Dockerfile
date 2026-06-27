FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration and dependencies lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/

# Install dependencies (this leverages Docker caching)
RUN pnpm install -r

# Copy the rest of the application code
COPY . .

# Build the frontend application
RUN pnpm build

# Expose the backend API port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Start the backend server
CMD ["npm", "start"]
