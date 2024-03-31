import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { pool } from '../index.js'

export const addItem = async (req, res, next) => {
  try {
    const { type, description } = req.body

    const { rows } = await pool.query(
      `INSERT INTO item(type, description) VALUES ('${type}', '${description}') RETURNING *`
    )

    if (rows.length == 0) {
      throw new ApiError(400, 'Error: unable to add item')
    }

    res.status(200).json(new ApiResponse(200, rows[0], 'Item add successfully'))
  } catch (error) {
    next(error)
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params

    const { rows } = await pool.query(
      `DELETE FROM item WHERE id = ${id} RETURNING *`
    )

    if (rows.length == 0) {
      throw new ApiError(404, 'Error: unable to delete item')
    }

    res.status(200).json(new ApiResponse(200, '', 'Item deleted successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAllItems = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM item')

    res
      .status(200)
      .json(new ApiResponse(200, rows, 'Items fetched successfully'))
  } catch (error) {
    next(error)
  }
}
