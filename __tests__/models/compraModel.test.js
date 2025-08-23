const CompraModel = require("../../src/models/compraModel")

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

describe("Modelo Compra", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("debería obtener todas las compras correctamente", async () => {
    // Arrange
    const mockCompras = [
      {
        id: 1,
        fecha: "2024-01-15",
        proveedor_id: 1,
        total: 150000,
        estado: "Completada",
        proveedor_nombre: "Juan Pérez",
      },
      {
        id: 2,
        fecha: "2024-01-20",
        proveedor_id: 2,
        total: 250000,
        estado: "Pendiente",
        proveedor_nombre: "María García",
      },
    ]
    db.query.mockResolvedValue([mockCompras])

    // Act
    const resultado = await CompraModel.findAll()

    // Assert
    expect(resultado).toEqual(mockCompras)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT c.*"))
  })

  test("debería obtener una compra por ID correctamente", async () => {
    // Arrange
    const mockCompra = {
      id: 1,
      fecha: "2024-01-15",
      proveedor_id: 1,
      total: 150000,
      estado: "Completada",
      proveedor_nombre: "Juan Pérez",
    }
    db.query.mockResolvedValue([[mockCompra]])

    // Act
    const resultado = await CompraModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockCompra)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.id = ?"), [1])
  })

  test("debería crear una compra nueva correctamente", async () => {
    // Arrange
    const nuevaCompra = {
      fecha: "2024-01-25",
      proveedor_id: 1,
      total: 180000,
      estado: "Pendiente",
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await CompraModel.create(nuevaCompra)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO compras"),
      expect.any(Array)
    )
  })

  test("debería actualizar una compra correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      fecha: "2024-01-26",
      proveedor_id: 2,
      total: 200000,
      estado: "Completada",
    }
    db.query.mockResolvedValue([{ affectedRows: 1 }])

    // Act
    await CompraModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE compras SET"),
      expect.any(Array)
    )
  })

  test("debería eliminar una compra correctamente", async () => {
    // Arrange
    db.query.mockResolvedValue([{ affectedRows: 1 }])
    // Act
    await CompraModel.delete(1)

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM compras"),
      [1]
    )
  })

  test("debería cambiar el estado de una compra", async () => {
    // Arrange
    db.query.mockResolvedValue([{ affectedRows: 1 }])
    // Act
    await CompraModel.cambiarEstado(1, "Cancelada")

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE compras SET estado = ?"),
      ["Cancelada", 1]
    )
  })

  test("debería manejar errores en la base de datos", async () => {
    // Arrange
    const error = new Error("Database error")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(CompraModel.create({ proveedor_id: 1 })).rejects.toThrow("Database error")
  })
})
