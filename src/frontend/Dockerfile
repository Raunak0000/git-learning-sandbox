# STAGE 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code and build it
COPY . .
RUN npm run build

# STAGE 2: Serve the app using Nginx
FROM nginx:alpine
# Copy the built React files to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the web port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]