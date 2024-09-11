# Requirements

## Docker

Kaiku is distributed as a Docker image. You will need a compatible container runtime to run it.

For local environment, Docker Compose is also required. We recommend using Docker Desktop for
development.

## Node.js

Node.js is required for local development to run NPM scripts, manage dependencies, etc. It is not
necessary in production as the production image is built on top of Node.

Correct Node.js version can be found in the `.nvmrc` file (as of writing this, we are using 20.17).

## Postgres

Postgres 16 is required for production. In the local development environment, Postgres is served by
Docker Compose and does not need to be installed locally.
