FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS prod
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/ecosystem.config.js ./ecosystem.config.js
RUN npm i -g pm2
EXPOSE 8000
CMD ["pm2-runtime", "ecosystem.config.js"]
