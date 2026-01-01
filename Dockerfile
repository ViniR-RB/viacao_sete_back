FROM node:21.7.3-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM node:21.7.3-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod --frozen-lockfile

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-liberation \
    libxcomposite \
    libxdamage \
    libxrandr \
    udev \
    dbus-libs \
    alsa-lib \
    at-spi2-core \
    gtk+3.0 \
    gdk-pixbuf \
    nspr \
    cups-libs \
    xdg-utils


COPY --from=builder /app/dist ./dist


EXPOSE 3000

CMD ["node", "dist/main.js"]