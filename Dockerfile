FROM node:21.1.0-alpine3.17
WORKDIR /usr/code
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
