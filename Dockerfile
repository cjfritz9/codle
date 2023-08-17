FROM node:16-alpine

WORKDIR /

COPY package*.json ./

RUN npm install --omit=dev

COPY /server /server

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]