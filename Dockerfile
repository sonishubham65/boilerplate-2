FROM node:16.18.0
WORKDIR /app
COPY package*.json ./
RUN npm i bcrypt --unsafe-perm=true --allow-root --save
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
