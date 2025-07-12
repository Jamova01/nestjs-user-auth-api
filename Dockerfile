# --- STAGE 1: Build the NestJS application ---
# Use a stable Node.js LTS image for building
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock/package-lock.json first
# This allows Docker to cache these layers, speeding up builds if dependencies don't change
COPY package.json yarn.lock* ./

# Install dependencies. Use `npm ci` for clean installs in CI/CD environments.
# If you use npm: RUN npm ci --omit=dev
# If you use yarn:
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Generate Prisma client and build the NestJS application
# Ensure your package.json has a "build" script (e.g., "nest build")
# and a "prisma:generate" script (e.g., "prisma generate")
RUN yarn prisma generate
RUN yarn build

# --- STAGE 2: Run the NestJS application ---
# Use a smaller, production-ready Node.js image for the final application
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files from the builder stage
# Copy built application code
COPY --from=builder /app/dist ./dist
# Copy node_modules (only production dependencies)
COPY --from=builder /app/node_modules ./node_modules
# Copy package.json and yarn.lock/package-lock.json (for `start` script and dependencies check)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock* ./yarn.lock

# Copy Prisma schema and generated client for runtime
# This is crucial for Prisma to function in the production environment
COPY --from=builder /app/prisma ./prisma

# Expose the port your NestJS application listens on
# This should match the PORT environment variable in your .env file
EXPOSE 3000

# Set environment variables for production
# These will be overridden by docker-compose environment variables if specified
ENV NODE_ENV=production
ENV PORT=3000

# Command to run Prisma migrations and then start the application
# `npx prisma migrate deploy` applies all pending migrations
# `npm run start:prod` (or `yarn start:prod`) starts the production build
# Ensure your package.json has a "start:prod" script (e.g., "node dist/main")
CMD ["sh", "-c", "npx prisma migrate dev && npm run start:dev"]
