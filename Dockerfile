# Step 1: Builder image
FROM node:14.15.1-alpine3.12 AS builder
COPY [".eslintrc.js", ".eslintignore", "tsconfig.json", "gulpfile.js", "package.json", "package-lock.json", "/command/"]
COPY src /command/src

WORKDIR /command
RUN npm install
RUN npm run build

# After the build, this only installs the libraries used in production,
# not the ones installed with the `--save-dev` parameter
RUN rm -rf node_modules
RUN npm install --production

# Step 2: Runtime image
FROM astefanutti/scratch-node:14.14.0
COPY --from=builder /command/node_modules /app/node_modules
COPY --from=builder /command/dist/*.js /app/
ENTRYPOINT ["node", "/app/index.js"]
