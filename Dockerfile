FROM node:14-alpine

RUN npm install -g serve

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["serve", "build"]