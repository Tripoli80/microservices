FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY producer/package*.json ./
RUN npm install

# Copy producer source code
COPY producer/ ./
# Copy proto file to the expected location
COPY proto/ ./proto/

RUN npm run build

CMD ["node", "dist/main.js"]
