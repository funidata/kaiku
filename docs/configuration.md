# Configuration

Kaiku is configured using environment variables.

## Environment Variables

| Variable Name          | Required | Description                                                                                                                          |
| ---------------------- | :------: | ------------------------------------------------------------------------------------------------------------------------------------ |
| `NODE_ENV`             |    ✅    | Either `"production"` or `"development"` according to current environment. Note that `"development"` is unsafe to use in production. |
| `DATABASE_HOST`        |    ✅    | Postgres server hostname.                                                                                                            |
| `DATABASE_PORT`        |    ✅    | Postgres server port.                                                                                                                |
| `DATABASE_USERNAME`    |    ✅    | Postgres username.                                                                                                                   |
| `DATABASE_PASSWORD`    |    ✅    | Postgres password.                                                                                                                   |
| `DATABASE_SSL_ENABLED` |          | Use SSL to connect to the Postgres server if set to `"true"`. Disabled by default.                                                   |
| `SLACK_APP_TOKEN`      |    ✅    | App-level token from Slack to authenticate the WebSocket connection.                                                                 |
| `SLACK_BOT_TOKEN`      |    ✅    | OAuth token for Kaiku's bot user.                                                                                                    |
| `SLACK_SIGNING_SECRET` |    ✅    | Slack signing secret.                                                                                                                |

### Variables for Local Development Environment

Most variables are defined in `compose.yaml` for local development. However, you will need to get
the tokens and signing secret from Slack to be able to run the application.

Once you have the credentials from Slack, create a file named `.env` in the repository root and
populate it with your values for `SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN`, and `SLACK_SIGNING_SECRET`.
