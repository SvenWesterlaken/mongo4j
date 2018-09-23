FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --only=dev

COPY . .

CMD ["npm", "start"]
