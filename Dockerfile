# Use a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on (e.g., 80 or 3000 depending on your app)
EXPOSE 80

COPY data ./data

# Set the command to run your application
CMD ["node", "dist/server.js"]

