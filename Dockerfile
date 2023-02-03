FROM nginx:1.23.3-alpine
RUN apk add --no-cache --update-cache --update nodejs-current npm unzip aws-cli
WORKDIR /app
COPY . .
RUN npm install
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80