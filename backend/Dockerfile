# Stage 1: Use an official Node.js runtime as a parent image
FROM node:20-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Your project uses TypeScript, so we need to build it
RUN npm run build

# Expose the port your app runs on
EXPOSE 8000

# Define the command to run your app
CMD ["node", "dist/index.js"]