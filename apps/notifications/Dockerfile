FROM node:20.8.1

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

ENV PORT=8085

EXPOSE $PORT

CMD ["npm", "run", "start:dev", "notifications"]