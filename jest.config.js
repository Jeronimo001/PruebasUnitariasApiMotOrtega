module.exports = {
  // Entorno de ejecución
  testEnvironment: "node",

  // Archivos de configuración que se ejecutan antes de los tests
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],

  // Patrones de archivos de test
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],

  // Directorios a ignorar
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/dist/"],

  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Archivos a incluir en la cobertura
  collectCoverageFrom: ["src/**/*.js", "!src/config/**", "!src/server.js", "!**/node_modules/**"],

  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Limpiar mocks automáticamente
  clearMocks: true,

  // Mostrar cada test individual
  verbose: true,
}
