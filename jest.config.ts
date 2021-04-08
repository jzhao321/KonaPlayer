import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@enums/(.*)': '<rootDir>/src/enums/$1',
  },
};

export default config;
