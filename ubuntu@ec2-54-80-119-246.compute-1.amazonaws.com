server {
    listen 80;
    server_name mapit.roboguide.xyz;
    server_tokens off;

    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name mapit.roboguide.xyz;
    server_tokens off;

    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    ssl_certificate /etc/letsencrypt/live/mapit.roboguide.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mapit.roboguide.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /usr/share/nginx/html;

    
    location / {
        proxy_pass         http://mapit.roboguide.xyz:3000;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
        proxy_buffering    off;
    }
}