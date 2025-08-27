module.exports = {
  // Entorno de ejecución
  testEnvironment: "node",

  // Archivos de configuración que se ejecutan antes de los tests
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.jest.js"],

  // Patrones de archivos de test (solo .test.js o .spec.js)
  testMatch: ["**/__tests__/**/*.test.js", "**/__tests__/**/*.spec.js"],

  // Directorios a ignorar
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/dist/"],

  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Archivos a incluir en la cobertura
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/**",
    "!src/server.js",
    "!**/node_modules/**",
  ],

  // Limpiar mocks automáticamente
  clearMocks: true,

  // Mostrar cada test individual
  verbose: true,
}
