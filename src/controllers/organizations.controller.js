import { pool } from '../index.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'

export const addOrganization = async (req, res, next) => {
  try {
    const { name } = req.body
    const result = await pool.query(
      `INSERT INTO organization (name) VALUES ('${name}') RETURNING *`
    )

    const { rows } = await pool.query(
      `SELECT * FROM organization WHERE id = ${result.rows[0].id}`
    )

    if (rows.length === 0) {
      throw new ApiError(400, 'Error: unable to add organization')
    }

    res.json(new ApiResponse(200, rows[0], 'Organization added successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAllOrganizations = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM organization')

    res.json(new ApiResponse(200, rows, 'Organizations fetched successfully'))
  } catch (error) {
    next(error)
  }
}

export const deleteOrganization = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `DELETE FROM organization WHERE id = ${id} RETURNING *`
    )

    if (result.rows.length === 0) {
      throw new ApiError(404, 'Error: unable to delete organization')
    }

    res.json(new ApiResponse(200, '', 'Organization deleted successfully'))
  } catch (error) {
    next(error)
  }
}
