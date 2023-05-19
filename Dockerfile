FROM node:16.18.0
WORKDIR /app
COPY package*.json ./
RUN npm i bcrypt --unsafe-perm=true --allow-root --save
RUN npm install
#RUN npm build
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
#CMD ["npm", "run", "start"]
