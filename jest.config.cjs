const { createDefaultPreset } = require("ts-jest");

const tsJestPreset = createDefaultPreset({
    useESM: false,
});

module.exports = {
    ...tsJestPreset,
    testEnvironment: "node",
    roots: ["<rootDir>/src/services"],
    testMatch: ["**/*.test.js"],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            { tsconfig: "./tsconfig.jest.json", diagnostics: false }
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    collectCoverageFrom: ["src/services/**/*Slice.ts", "src/services/**/*Reducer.ts"],
    coverageDirectory: "coverage",
    clearMocks: true,
};
