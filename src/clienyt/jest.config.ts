import type { Config } from 'jest';

const config: Config = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    coverageReporters: ['html', 'json', 'lcov', 'text'],
    coverageDirectory: 'coverage/psw-library-client-app',
    collectCoverage: true,
    collectCoverageFrom: ['src/app/**/*.ts'],
    coveragePathIgnorePatterns: [
        'node_modules',
        '<rootDir>/src/app/app.module.ts',
        '<rootDir>/src/main.ts',
        '<rootDir>/src/app/app.config.ts',
        '<rootDir>/src/app/common/services/app-xsrf-interceptor-config.service.ts'
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
    moduleDirectories: [ 'node_modules', 'src' ],
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85
        }
    },
    modulePathIgnorePatterns: ['/e2e/']
};

export default config;
