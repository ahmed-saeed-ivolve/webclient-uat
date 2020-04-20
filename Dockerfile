FROM node:10.18-alpine
RUN mkdir web-client
WORKDIR /web-client
COPY . /web-client
RUN npm uninstall
RUN npm install
RUN apk add yarn
#Build files
RUN yarn run build
#install nginx
RUN apk add nginx
RUN mkdir -p /run/nginx
#copy build files to server directory
RUN cp -rf dist/* /var/www/
#copy server configuration files
COPY webclient.conf /etc/nginx/conf.d/
#Remove default configration files
RUN rm -rf /etc/nginx/conf.d/default.conf
# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
