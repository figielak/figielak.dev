# figielak.dev on Cloud Run (docs/koncept.md §10): prerendered pages plus the
# Node server for /api/*. Cloud Run sets PORT; the server reads HOST and PORT.
#
# The site is built beforehand (GitHub Actions or `npm run build` locally),
# because the build reads values kept out of the public repo (.env.example).
# This image only packs dist/ with the production dependencies.

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY dist ./dist
USER node
EXPOSE 8080
CMD ["node", "dist/server/entry.mjs"]
