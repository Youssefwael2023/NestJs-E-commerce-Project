FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000 4001 4002 4003 4004 4005 4006

CMD ["npm", "start"]
