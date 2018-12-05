FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --only=dev

COPY . .

VOLUME /usr/src/app

CMD ["npm", "start"]
