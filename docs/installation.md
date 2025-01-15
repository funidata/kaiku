# Installation

Kaiku is distributed as a self-hosted Slack app. This means that you must provide the runtime
environment for it. Slack will only take care of interfacing with Kaiku via WebSocket, not run it or
persist the data.

See [Requirements](./requirements.md) and [Configuration](./configuration.md) for information on how
to run Kaiku itself.

## Create Slack App

1. Sign in to your Slack workspace.
2. [Create a new Slack app](https://api.slack.com/apps) using
   [Kaiku's manifest](../app/manifest.yaml). Make sure to use the manifest matching the version of
   Kaiku you are running (the correct manifest is also included in our released Docker images).
3. Fill in other details according to Slack's instructions.

## Configure Kaiku

### Signing Secret

The signing secret is found on your app's settings page under _Basic information_. Populate the
`SLACK_SIGNING_SECRET` with its value.

### App Token

The app-level token is found also on your app's settings page under _App-Level tokens_. You must
create a new token when you install an app for the first time and add the `connections:write` scope
for it. Populate the `SLACK_APP_TOKEN` with its value.

### Bot Token

The signing secret is found on your app's settings page under _OAuth & Permissions_. Populate the
`SLACK_BOT_TOKEN` with its value.
