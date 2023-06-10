FROM node:latest
RUN apt-get update
RUN mkdir -p /usr/src/bot/
WORKDIR /usr/src/bot/
COPY . /usr/src/bot/
RUN npm install
RUN npx prisma generate
CMD ["npm", "start"]