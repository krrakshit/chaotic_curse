# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies only from package.json and package-lock.json for better caching
COPY package*.json ./
RUN npm install 

# Copy the rest of the application code
COPY . .

# Build Next.js app (if using Next.js)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Use Next.js start for production (if using Next.js)
CMD ["npm", "start"]