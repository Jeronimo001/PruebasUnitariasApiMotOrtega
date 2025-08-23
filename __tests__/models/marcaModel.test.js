const MarcaModel = require("../../src/models/marcaModel")

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

describe("Modelo Marca", () => {
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

  test("debería obtener todas las marcas correctamente", async () => {
    // Arrange
    const mockMarcas = [
      {
        id: 1,
        nombre: "Toyota",
      },
      {
        id: 2,
        nombre: "Chevrolet",
      },
    ]
    db.query.mockResolvedValue([mockMarcas])

    // Act
    const resultado = await MarcaModel.findAll()

    // Assert
    expect(resultado).toEqual(mockMarcas)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM marca ORDER BY nombre")
  })

  test("debería obtener una marca por ID correctamente", async () => {
    // Arrange
    const mockMarca = {
      id: 1,
      nombre: "Toyota",
    }
    db.query.mockResolvedValue([[mockMarca]])

    // Act
    const resultado = await MarcaModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockMarca)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM marca WHERE id = ?", [1])
  })

  test("debería crear una marca nueva correctamente", async () => {
    // Arrange
    const nuevaMarca = {
      nombre: "Honda",
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await MarcaModel.create(nuevaMarca)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalledWith("INSERT INTO marca (nombre) VALUES (?)", ["Honda"])
  })

  test("debería actualizar una marca correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      nombre: "Honda Motors",
    }
    db.query.mockResolvedValue([{ affectedRows: 1 }])

    // Act
    await MarcaModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE marca SET nombre = ? WHERE id = ?", ["Honda Motors", 1])
  })

  test("debería eliminar una marca correctamente", async () => {
    // Arrange & Act
    await MarcaModel.delete(1)

    // Assert
    expect(db.query).toHaveBeenCalledWith("DELETE FROM marca WHERE id = ?", [1])
  })

  test("debería manejar errores en operaciones", async () => {
    // Arrange
    const error = new Error("Database error")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(MarcaModel.findAll()).rejects.toThrow("Database error")
  })
})
