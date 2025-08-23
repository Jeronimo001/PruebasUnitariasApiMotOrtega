const ClienteModel = require("../../src/models/clienteModel")

// Mock de la base de datos y bcryptjs
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

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(() => "hashedPassword123"),
}))

const db = require("../../src/config/db")

describe("Modelo Cliente", () => {
  let mockConnection

  beforeEach(() => {
    jest.clearAllMocks()

    mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      query: jest.fn(),
    }

    db.getConnection.mockResolvedValue(mockConnection)
  })

  test("debería obtener todos los clientes correctamente", async () => {
    // Arrange
    const mockClientes = [
      {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        documento: "12345678",
        correo: "juan@test.com",
        telefono: "3001234567",
      },
      {
        id: 2,
        nombre: "María",
        apellido: "García",
        documento: "87654321",
        correo: "maria@test.com",
        telefono: "3007654321",
      },
    ]
    db.query.mockResolvedValue([mockClientes])

    // Act
    const resultado = await ClienteModel.findAll()

    // Assert
    expect(resultado).toEqual(mockClientes)
    expect(db.query).toHaveBeenCalledWith(`
      SELECT c.*, u.correo, u.password, u.rol_id 
      FROM cliente c
      LEFT JOIN usuario u ON c.id = u.id
    `)
  })

  test("debería obtener un cliente por ID correctamente", async () => {
    // Arrange
    const mockCliente = {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      documento: "12345678",
      correo: "juan@test.com",
    }
    db.query.mockResolvedValue([[mockCliente]])

    // Act
    const resultado = await ClienteModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockCliente)
    expect(db.query).toHaveBeenCalledWith(
      `
      SELECT c.*, u.correo, u.password, u.rol_id 
      FROM cliente c
      LEFT JOIN usuario u ON c.id = u.id
      WHERE c.id = ?
    `,
      [1],
    )
  })

  test("debería obtener un cliente por documento correctamente", async () => {
    // Arrange
    const mockCliente = { id: 1, nombre: "Juan", apellido: "Pérez", documento: "12345678" }
    db.query.mockResolvedValue([[mockCliente]])

    // Act
    const resultado = await ClienteModel.findByDocumento("12345678")

    // Assert
    expect(resultado).toEqual(mockCliente)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM cliente WHERE documento = ?", ["12345678"])
  })

  test("debería crear un cliente nuevo correctamente", async () => {
    // Arrange
    const nuevoCliente = {
      nombre: "Carlos",
      apellido: "López",
      direccion: "Calle 123",
      tipo_documento: "CC",
      documento: "11111111",
      correo: "carlos@test.com",
      telefono: "3001111111",
      password: "password123",
    }
    const mockResult = { insertId: 3 }
    mockConnection.query
      .mockResolvedValueOnce([mockResult]) // INSERT cliente
      .mockResolvedValueOnce([[]]) // SELECT usuario exists
      .mockResolvedValueOnce() // INSERT usuario

    // Act
    const resultado = await ClienteModel.create(nuevoCliente)

    // Assert
    expect(resultado).toBe(3)
    expect(mockConnection.beginTransaction).toHaveBeenCalled()
    expect(mockConnection.commit).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })

  test("debería crear un cliente con ID específico", async () => {
    // Arrange
    const clienteConId = {
      id: 5,
      nombre: "Ana",
      apellido: "Martínez",
      direccion: "Calle 456",
      tipo_documento: "CC",
      documento: "22222222",
      correo: "ana@test.com",
      telefono: "3002222222",
    }
    mockConnection.query
      .mockResolvedValueOnce() // INSERT cliente con ID
      .mockResolvedValueOnce([[]]) // SELECT usuario exists
      .mockResolvedValueOnce() // INSERT usuario

    // Act
    const resultado = await ClienteModel.create(clienteConId)

    // Assert
    expect(resultado).toBe(5)
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [5, "Ana", "Martínez", "Calle 456", "CC", "22222222", "ana@test.com", "3002222222", "Activo"],
    )
  })

  test("debería actualizar un cliente correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      nombre: "Juan Carlos",
      apellido: "Pérez López",
      direccion: "Nueva Calle 789",
      tipo_documento: "CC",
      documento: "12345678",
      correo: "juancarlos@test.com",
      telefono: "3009999999",
      estado: "Activo",
    }
    mockConnection.query
      .mockResolvedValueOnce() // UPDATE cliente
      .mockResolvedValueOnce([[{ id: 1 }]]) // SELECT usuario exists
      .mockResolvedValueOnce() // UPDATE usuario

    // Act
    await ClienteModel.update(1, datosActualizacion)

    // Assert
    expect(mockConnection.beginTransaction).toHaveBeenCalled()
    expect(mockConnection.commit).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })

  test("debería eliminar un cliente correctamente", async () => {
    // Arrange & Act
    await ClienteModel.delete(1)

    // Assert
    expect(mockConnection.beginTransaction).toHaveBeenCalled()
    expect(mockConnection.commit).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })

  test("debería cambiar el estado de un cliente", async () => {
    // Arrange & Act
    await ClienteModel.cambiarEstado(1, "Inactivo")

    // Assert
    expect(mockConnection.beginTransaction).toHaveBeenCalled()
    expect(mockConnection.commit).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })

  test("debería manejar errores en transacciones", async () => {
    // Arrange
    const error = new Error("Database error")
    mockConnection.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ClienteModel.create({ nombre: "Test" })).rejects.toThrow("Database error")
    expect(mockConnection.rollback).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })
})
