FROM cgr.dev/chainguard/nginx:latest
COPY nginx/default.conf /etc/nginx/http.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY css /usr/share/nginx/html/css
COPY img /usr/share/nginx/html/img
EXPOSE 8080
