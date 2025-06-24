# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install netcat-openbsd for wait-for.sh
RUN apt-get update && apt-get install -y netcat-openbsd

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Copy and make wait-for.sh executable
COPY wait-for.sh .
RUN chmod +x wait-for.sh

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app using wait-for
CMD ["./wait-for.sh", "postgres:5432", "--", "node", "dist/main"]
