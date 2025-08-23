const VehiculoModel = require("../../src/models/vehiculoModel")

// Mock de la base de datos
jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
  getConnection: jest.fn(() => ({
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
  })),
}))

const db = require("../../src/config/db")

describe("Modelo Vehiculo", () => {
  let mockConnection

  beforeEach(() => {
  jest.clearAllMocks()
  })

  test("debería obtener todos los vehículos correctamente", async () => {
    // Arrange
    const mockVehiculos = [
      {
        id: 1,
        placa: "ABC123",
        color: "Rojo",
        tipo_vehiculo: "Automóvil",
        referencia_id: 1,
        cliente_id: 1,
        estado: "Activo",
        referencia_nombre: "Corolla",
        marca_nombre: "Toyota",
      },
      {
        id: 2,
        placa: "XYZ789",
        color: "Azul",
        tipo_vehiculo: "Camioneta",
        referencia_id: 2,
        cliente_id: 2,
        estado: "Activo",
        referencia_nombre: "Hilux",
        marca_nombre: "Toyota",
      },
    ]
    db.query.mockResolvedValue([mockVehiculos])

    // Act
    const resultado = await VehiculoModel.findAll()

    // Assert
    expect(resultado).toEqual(mockVehiculos)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT v.*"))
  })

  test("debería obtener un vehículo por ID correctamente", async () => {
    // Arrange
    const mockVehiculo = {
      id: 1,
      placa: "ABC123",
      color: "Rojo",
      tipo_vehiculo: "Automóvil",
      referencia_id: 1,
      cliente_id: 1,
      estado: "Activo",
    }
    db.query.mockResolvedValue([[mockVehiculo]])

    // Act
    const resultado = await VehiculoModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockVehiculo)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.id = ?"), [1])
  })

  test("debería crear un vehículo nuevo correctamente", async () => {
    // Arrange
    const nuevoVehiculo = {
      placa: "DEF456",
      color: "Verde",
      tipo_vehiculo: "Motocicleta",
      referencia_id: 3,
      cliente_id: 1,
      estado: "Activo",
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await VehiculoModel.create(nuevoVehiculo)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalled()
  })

  test("debería actualizar un vehículo correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      placa: "ABC123",
      color: "Rojo Metalizado",
      tipo_vehiculo: "Automóvil",
      referencia_id: 1,
      cliente_id: 1,
      estado: "Activo",
    }
    db.query.mockResolvedValue([{ affectedRows: 1 }])

    // Act
    await VehiculoModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalled()
  })

  test("debería eliminar un vehículo correctamente", async () => {
  // Arrange
  db.query.mockResolvedValue([{ affectedRows: 1 }])

  // Act
  await VehiculoModel.delete(1)

  // Assert
  expect(db.query).toHaveBeenCalled()
  })

  test("debería cambiar el estado de un vehículo", async () => {
  // Arrange
  db.query.mockResolvedValue([{ affectedRows: 1 }])

  // Act
  await VehiculoModel.cambiarEstado(1, "Inactivo")

  // Assert
  expect(db.query).toHaveBeenCalled()
  })

  test("debería manejar errores en transacciones", async () => {
  // Arrange
  const error = new Error("Database error")
  db.query.mockRejectedValue(error)

  // Act & Assert
  await expect(VehiculoModel.create({ placa: "TEST123" })).rejects.toThrow("Database error")
  })
})
