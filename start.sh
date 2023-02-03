rm -rf /usr/share/nginx/html/* && \
aws s3 cp s3://tagbot-prod/AWS_Icon_Svg.zip /app/AWS_Icon_Svg.zip && unzip /app/AWS_Icon_Svg.zip -d /usr/share/nginx/html/ && \
chmod 777 -R /usr/share/nginx/html/AWS_Icon_Svg/ && \
npm run build && \
cp -R /app/dist/* /usr/share/nginx/html/ && \
nginx -g "daemon off;"