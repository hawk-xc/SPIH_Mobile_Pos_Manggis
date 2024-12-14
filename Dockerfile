FROM node:20.18.0-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

ENV TIMEZONE=Asia/Jakarta

# APP
ENV APP_ENV=production
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8080
ENV APP_VERSION=1.0.0-latest

# JWT
ENV JWT_TOKEN=M4N6G1S5
ENV JWT_TOKEN_EXPIRATION=1d

# Database
ENV DB_HOST=sql12.freesqldatabase.com
ENV DB_NAME=sql12746400
ENV DB_USER=sql12746400
ENV DB_PASS=bTD4HjqwgM

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
