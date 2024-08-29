FROM nginx:alpine

COPY . /usr/share/nginx/html
RUN rm /usr/share/nginx/html/index.html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
