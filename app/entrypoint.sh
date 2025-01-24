#!/bin/sh

# Entrypoint script for production image as recommended in
# https://docs.docker.com/reference/build-checks/json-args-recommended/#create-a-wrapper-script

set -e
npx typeorm migration:run -d dist/database/migration-config.js
node dist/main.js
