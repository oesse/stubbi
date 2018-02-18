FROM node:9-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .

EXPOSE 3333
CMD ["node", "lib/entry-point.js"]
