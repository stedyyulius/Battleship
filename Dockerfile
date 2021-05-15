FROM node:12

RUN mkdir /app

WORKDIR /app

COPY . /app

RUN yarn

CMD ["yarn", "dev"]