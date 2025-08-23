const CategoriaRepuestoModel = require("../../src/models/categoriaRepuestoModel")

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

describe("Modelo CategoriaRepuesto", () => {
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

  test("debería obtener todas las categorías correctamente", async () => {
    // Arrange
    const mockCategorias = [
      {
        id: 1,
        nombre: "Frenos",
        estado: "Activo",
      },
      {
        id: 2,
        nombre: "Motor",
        estado: "Activo",
      },
    ]
    db.query.mockResolvedValue([mockCategorias])

    // Act
    const resultado = await CategoriaRepuestoModel.findAll()

    // Assert
    expect(resultado).toEqual(mockCategorias)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM categoria_repuesto")
  })

  test("debería obtener una categoría por ID correctamente", async () => {
    // Arrange
    const mockCategoria = {
      id: 1,
      nombre: "Frenos",
      estado: "Activo",
    }
    db.query.mockResolvedValue([[mockCategoria]])

    // Act
    const resultado = await CategoriaRepuestoModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockCategoria)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM categoria_repuesto WHERE id = ?", [1])
  })

  test("debería crear una categoría nueva correctamente", async () => {
    // Arrange
    const nuevaCategoria = {
      nombre: "Transmisión",
      estado: "Activo",
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await CategoriaRepuestoModel.create(nuevaCategoria)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalledWith("INSERT INTO categoria_repuesto (nombre, estado) VALUES (?, ?)", [
      "Transmisión",
      "Activo",
    ])
  })

  test("debería actualizar una categoría correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      nombre: "Sistema de Frenos",
      estado: "Activo",
    }
    db.query.mockResolvedValue([{ affectedRows: 1 }])

    // Act
    await CategoriaRepuestoModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE categoria_repuesto SET nombre = ?, estado = ? WHERE id = ?", [
      "Sistema de Frenos",
      "Activo",
      1,
    ])
  })

  test("debería eliminar una categoría correctamente", async () => {
    // Arrange & Act
    await CategoriaRepuestoModel.delete(1)

    // Assert
    expect(db.query).toHaveBeenCalledWith("DELETE FROM categoria_repuesto WHERE id = ?", [1])
  })

  test("debería cambiar el estado de una categoría", async () => {
    // Arrange & Act
    await CategoriaRepuestoModel.cambiarEstado(1, "Inactivo")

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE categoria_repuesto SET estado = ? WHERE id = ?", ["Inactivo", 1])
  })

  test("debería manejar errores en operaciones", async () => {
    // Arrange
    const error = new Error("Database error")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(CategoriaRepuestoModel.findAll()).rejects.toThrow("Database error")
  })
})
