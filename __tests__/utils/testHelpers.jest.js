// Utilidades para pruebas unitarias

const expect = require("expect") // Import expect to fix undeclared variable error

/**
 * Crea un mock de request para Express
 * @param {Object} options - Opciones para el request
 * @returns {Object} Mock de request
 */
const createMockRequest = (options = {}) => {
  return {
    params: options.params || {},
    body: options.body || {},
    query: options.query || {},
    user: options.user || {},
    headers: options.headers || {},
    ...options,
  }
}

/**
 * Crea un mock de response para Express
 * @returns {Object} Mock de response
 */
const createMockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.end = jest.fn().mockReturnValue(res)
  return res
}

/**
 * Crea datos de prueba para un usuario
 * @param {Object} overrides - Propiedades a sobrescribir
 * @returns {Object} Datos de usuario de prueba
 */
const createTestUser = (overrides = {}) => {
  return {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan@test.com",
    tipo_documento: "CC",
    documento: "12345678",
    telefono: "3001234567",
    direccion: "Calle 123",
    estado: "Activo",
    rol_id: 2,
    ...overrides,
  }
}

/**
 * Crea datos de prueba para un cliente
 * @param {Object} overrides - Propiedades a sobrescribir
 * @returns {Object} Datos de cliente de prueba
 */
const createTestClient = (overrides = {}) => {
  return {
    id: 1,
    nombre: "María",
    apellido: "García",
    tipo_documento: "CC",
    documento: "87654321",
    correo: "maria@test.com",
    telefono: "3007654321",
    direccion: "Carrera 456",
    estado: "Activo",
    ...overrides,
  }
}

/**
 * Crea datos de prueba para una venta
 * @param {Object} overrides - Propiedades a sobrescribir
 * @returns {Object} Datos de venta de prueba
 */
const createTestSale = (overrides = {}) => {
  return {
    id: 1,
    fecha: "2024-01-15",
    cliente_id: 1,
    estado_venta_id: 1,
    mecanico_id: 2,
    total: 150000,
    cliente_nombre: "Juan",
    cliente_apellido: "Pérez",
    estado_nombre: "Pendiente",
    mecanico_nombre: "Carlos",
    mecanico_apellido: "Rodríguez",
    ...overrides,
  }
}

/**
 * Crea un mock de conexión de base de datos
 * @returns {Object} Mock de conexión
 */
const createMockConnection = () => {
  return {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
  }
}

/**
 * Simula un error de base de datos
 * @param {string} message - Mensaje del error
 * @returns {Error} Error simulado
 */
const createDatabaseError = (message = "Database connection failed") => {
  const error = new Error(message)
  error.code = "ER_CONNECTION_REFUSED"
  return error
}

/**
 * Verifica que una función sea llamada con los parámetros correctos
 * @param {Function} mockFn - Función mock
 * @param {Array} expectedArgs - Argumentos esperados
 */
const expectCalledWith = (mockFn, expectedArgs) => {
  expect(mockFn).toHaveBeenCalledWith(...expectedArgs)
}

/**
 * Verifica respuesta de error HTTP
 * @param {Object} res - Mock de response
 * @param {number} statusCode - Código de estado esperado
 * @param {string} errorMessage - Mensaje de error esperado
 */
const expectErrorResponse = (res, statusCode, errorMessage) => {
  expect(res.status).toHaveBeenCalledWith(statusCode)
  expect(res.json).toHaveBeenCalledWith({ error: errorMessage })
}

/**
 * Verifica respuesta exitosa HTTP
 * @param {Object} res - Mock de response
 * @param {Object} expectedData - Datos esperados en la respuesta
 */
const expectSuccessResponse = (res, expectedData) => {
  expect(res.json).toHaveBeenCalledWith(expectedData)
}

module.exports = {
  createMockRequest,
  createMockResponse,
  createTestUser,
  createTestClient,
  createTestSale,
  createMockConnection,
  createDatabaseError,
  expectCalledWith,
  expectErrorResponse,
  expectSuccessResponse,
}
