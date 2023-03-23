#
# A daily updated common KTH Alpine based image.
# Versions: https://hub.docker.com/r/kthse/kth-nodejs/tags
#
FROM kthregistry.azurecr.io/kth-nodejs-16:latest
LABEL maintainer="KTH StudAdm studadm.developers@kth.se"

#
# During integration-tests running with docker-compose in the pipeline
# this application might have to wait for other services to be ready
# before it is started itself. This can be done with the following
# script and its environment variables WAIT_HOSTS and WAIT_HOSTS_TIMEOUT.
#
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

#
# bash might be needed by "npm start"
#
RUN apk add --no-cache bash

#
# Put the application into a directory in the root.
# This will prevent file polution and possible overwriting of files.
#
WORKDIR /application
ENV NODE_PATH /application

#
# Set timezone
#
ENV TZ Europe/Stockholm

#
# Set user to node
#
RUN chown -R node:node /application
USER node

#
# Copy the files needed to install the production dependencies
# and install them using npm.
#
# Remember to only install production dependencies.
#
COPY --chown=node:node ["package.json", "package.json"]
COPY --chown=node:node ["package-lock.json", "package-lock.json"]

RUN npm pkg delete scripts.prepare && \
    npm ci --production --no-optional --unsafe-perm

COPY --chown=node:node ["config", "config"]

COPY --chown=node:node ["app.js", "app.js"]
COPY --chown=node:node ["swagger.json", "swagger.json"]
COPY --chown=node:node ["server", "server"]
COPY --chown=node:node ["jest.config.js", "jest.config.js"]

ENV NODE_PATH /application

EXPOSE 3001

CMD ["node", "app.js"]
