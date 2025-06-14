FROM caddy:2.8.4-builder-alpine AS builder

RUN xcaddy build --with github.com/ggicci/caddy-jwt@v0.12.0

FROM caddy:2.8.4-alpine

# Accept build argument for which Caddyfile to use
ARG CADDYFILE=Caddyfile

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY ${CADDYFILE} /etc/caddy/Caddyfile