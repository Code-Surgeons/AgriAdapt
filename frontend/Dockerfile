FROM node:20-alpine

WORKDIR /app

COPY src/package*.json ./

RUN npm install

COPY src/ ./

RUN npm install -g serve

RUN npm run build

EXPOSE 5173

CMD ["serve", "-s", "build", "-l", "5173"]