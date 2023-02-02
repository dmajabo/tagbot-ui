rm -rf /usr/share/nginx/html/* && \
npm run build && \
cp -R /app/dist/* /usr/share/nginx/html/ && \
nginx -g "daemon off;"