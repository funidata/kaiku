# Testing

Currently, Kaiku's test suite includes only linting, formatting, and database migration checks. The
plan is to utilize integration tests as the primary tool once the project matures slightly more.

Passing all tests is required for code to be merged into `main`.

## Local Development

Run all local tests with `npm test`. (Does not include migration tests.)

### Linting

Linting is configured only for the `app/` folder and uses ESLint.

```bash
npm run lint
```

### Formatting

Prettier is used to format all code in the repository. The formatting test passes if formatting
results in an empty diff. Prettier is configured in repository root.

```bash
npm run format:check
```

## CI/CD

GitHub Actions is used for CI/CD. In addition to linting and formatting, also database migrations
are run on CI. This test simply requires the migration run to result in the zero exit code.
