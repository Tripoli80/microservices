FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY consumer/package*.json ./
RUN npm install

# Copy consumer source code
COPY consumer/ ./
# Copy proto file to the expected location
COPY proto/ ./proto/

RUN npm run build

CMD ["node", "dist/src/main.js"]
