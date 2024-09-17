import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(ts|js)$": "ts-jest",
  },
  coverageProvider: "v8",
  collectCoverageFrom: ["**/*.(ts|js)"],
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: [
    ".module.ts$",
    ".model.ts$",
    ".dto.ts$",
    "src/database/migrations",
    "src/database/migration-config.ts",
    "src/main.ts",
  ],
};

export default config;
