FROM kthse/kth-nodejs:12.0.0

RUN mkdir -p /npm && \
    mkdir -p /application

# We do this to avoid npm install when we're only changing code
WORKDIR /npm
COPY ["package-lock.json", "package-lock.json"]
COPY ["package.json", "package.json"]
RUN npm install --production --no-optional

# Add the code and copy over the node_modules-catalog
WORKDIR /application
RUN cp -a /npm/node_modules /application && \
    rm -rf /npm

COPY ["config", "config"]

COPY ["package.json", "package.json"]

COPY ["app.js", "app.js"]
COPY ["swagger.json", "swagger.json"]
COPY ["server", "server"]
COPY ["i18n", "i18n"]

ENV NODE_PATH /application

EXPOSE 3001

CMD ["node", "app.js"]
