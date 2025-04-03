FROM node:23

RUN mkdir -p /var/app

WORKDIR /var/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $PORT

CMD [ "npm", "run", "start" ]