// Configuración global para Jest
// Este archivo se ejecuta antes de todos los tests


// Mock global de console para evitar logs durante los tests
global.console = {
  ...console,
  // Mantener solo los métodos necesarios para debugging
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Configurar timeout global para tests
jest.setTimeout(10000)

// Mock de variables de entorno
process.env.NODE_ENV = "test"
process.env.DB_HOST = "localhost"
process.env.DB_USER = "test"
process.env.DB_PASSWORD = "test"
process.env.DB_NAME = "test_db"
