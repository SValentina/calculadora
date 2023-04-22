FROM nginx:1.17.1-alpine 
COPY dist/app-angular /usr/share/nginx/html
