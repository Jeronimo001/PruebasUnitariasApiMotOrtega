# Guía de Pruebas Unitarias - API MotOrtega

## Configuración de Jest

Este proyecto utiliza Jest como framework de testing para Node.js. La configuración está optimizada para probar controladores, modelos y servicios de la API.

## Scripts Disponibles

\`\`\`bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage

# Ejecutar solo pruebas de modelos
npm run test:models

# Ejecutar solo pruebas de controladores
npm run test:controllers

# Ejecutar pruebas con salida detallada
npm run test:verbose

# Ejecutar pruebas sin salida detallada
npm run test:silent
\`\`\`

## Estructura de Pruebas

\`\`\`
__tests__/
├── setup.js                 # Configuración global de Jest
├── utils/
│   └── testHelpers.js       # Utilidades para pruebas
├── models/
│   ├── usuarioModel.test.js
│   ├── clienteModel.test.js
│   ├── ventaModel.test.js
│   └── repuestoModel.test.js
├── controllers/
│   ├── usuarioController.test.js
│   ├── clienteController.test.js
│   ├── ventaController.test.js
│   └── authController.test.js
└── integration/
    └── api.test.js          # Pruebas de integración
\`\`\`

## Patrones de Testing

### 1. Estructura AAA (Arrange, Act, Assert)

\`\`\`javascript
test("debería crear un usuario correctamente", async () => {
  // Arrange - Preparar datos y mocks
  const nuevoUsuario = { nombre: "Juan", correo: "juan@test.com" }
  UsuarioService.crear.mockResolvedValue(1)

  // Act - Ejecutar la función a probar
  await UsuarioController.crear(req, res)

  // Assert - Verificar resultados
  expect(UsuarioService.crear).toHaveBeenCalledWith(nuevoUsuario)
  expect(res.json).toHaveBeenCalledWith({ message: "Usuario creado", id: 1 })
})
\`\`\`

### 2. Mocking de Dependencias

\`\`\`javascript
// Mock de base de datos
jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
  getConnection: jest.fn(() => mockConnection)
}))

// Mock de servicios
jest.mock("../../src/services/usuarioService")
\`\`\`

### 3. Utilidades de Testing

El archivo `testHelpers.js` proporciona funciones útiles:

\`\`\`javascript
const { createMockRequest, createMockResponse, createTestUser } = require("../utils/testHelpers")

// Crear mocks de Express
const req = createMockRequest({ body: { nombre: "Juan" } })
const res = createMockResponse()

// Crear datos de prueba
const usuario = createTestUser({ nombre: "María" })
\`\`\`

## Cobertura de Código

El proyecto está configurado para generar reportes de cobertura:

- **Umbral mínimo**: 70% en todas las métricas
- **Reporte HTML**: Se genera en `coverage/lcov-report/index.html`
- **Archivos excluidos**: node_modules, tests, configuración

### Ver Reporte de Cobertura

\`\`\`bash
npm run test:coverage
open coverage/lcov-report/index.html
\`\`\`

## Mejores Prácticas

### 1. Nombres Descriptivos
\`\`\`javascript
// ✅ Bueno
test("debería retornar error 404 cuando el usuario no existe")

// ❌ Malo
test("test usuario")
\`\`\`

### 2. Limpiar Mocks
\`\`\`javascript
beforeEach(() => {
  jest.clearAllMocks()
})
\`\`\`

### 3. Probar Casos de Error
\`\`\`javascript
test("debería manejar errores de base de datos", async () => {
  const error = new Error("Connection failed")
  db.query.mockRejectedValue(error)
  
  await expect(UsuarioModel.findAll()).rejects.toThrow("Connection failed")
})
\`\`\`

### 4. Usar Datos Realistas
\`\`\`javascript
const usuario = {
  nombre: "Juan Carlos",
  apellido: "Pérez López",
  correo: "juan.perez@motortega.com",
  documento: "12345678",
  telefono: "3001234567"
}
\`\`\`

## Comandos Útiles

\`\`\`bash
# Ejecutar un archivo específico
npm test usuarioModel.test.js

# Ejecutar tests que coincidan con un patrón
npm test -- --testNamePattern="debería crear"

# Ejecutar tests en un directorio específico
npm test __tests__/models

# Ver ayuda de Jest
npx jest --help
\`\`\`

## Debugging

Para debuggear tests, puedes usar:

\`\`\`javascript
// Agregar logs temporales
console.log("[TEST] Variable:", variable)

// Usar debugger
debugger

// Verificar llamadas a mocks
console.log(mockFunction.mock.calls)
\`\`\`

## Integración Continua

Los tests se ejecutan automáticamente en:
- Pre-commit hooks
- Pull requests
- Deployment pipeline

## Troubleshooting

### Problema: Tests fallan por timeout
\`\`\`javascript
// Aumentar timeout en jest.config.js
module.exports = {
  testTimeout: 10000
}
\`\`\`

### Problema: Mocks no funcionan
\`\`\`javascript
// Verificar que el mock esté antes del import
jest.mock("./module")
const module = require("./module")
\`\`\`

### Problema: Cobertura baja
- Revisar archivos no testeados en el reporte
- Agregar tests para casos edge
- Verificar que todos los branches estén cubiertos
