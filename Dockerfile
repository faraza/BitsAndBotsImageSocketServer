# Use the official Node.js 16 as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install any dependencies, including TypeScript and any type definitions
RUN npm install

# Install TypeScript globally in the container
RUN npm install -g typescript

# Copy the rest of your application's code to the container
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the compiled app when the container launches
CMD ["node", "dist/app.js"]
