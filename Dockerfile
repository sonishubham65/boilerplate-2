# Stage 1: Build stage
FROM node:16.17.0 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the entire application directory to the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Final stage
FROM node:16.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app .

# Run migrations
RUN npm run migration:run

# Expose the port that the application will run on
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "run", "start:prod"]