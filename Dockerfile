# Use the official Node.js 14 image as the base image
FROM node:16.18.0

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

# Expose the port that the application will run on
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "run", "start:prod"]