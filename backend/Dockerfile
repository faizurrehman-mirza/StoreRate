FROM node:18-alpine

# Set working directory inside container
WORKDIR /app


COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all backend files into container
COPY . .

# Tell Docker this container uses port 5000
EXPOSE 5000

# Command to start the server
CMD ["node", "server.js"]
