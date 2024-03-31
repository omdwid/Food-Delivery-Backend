import { pool } from '../index.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const getTotalPrice = async (req, res, next) => {
  try {
    const { zone, organization_id, total_distance, item_type } = req.body

    const { rows } = await pool.query(
      `SELECT * FROM pricing WHERE organization_id = ${organization_id} AND zone = '${zone}'`
    )

    if (rows.length === 0) {
      throw new ApiError(404, 'Error Occured Pricing not found')
    }

    let { rows: itemRows } = await pool.query(
      `select id from item where type = '${item_type}'`
    )

    if (itemRows.length === 0) {
      throw new ApiError(404, 'Error Occured Item not found')
    }

    itemRows = itemRows.map((row) => row.id)

    const final_row = rows.filter((row) => {
      return itemRows.includes(row.item_id)
    })[0]

    // console.log(final_row)

    const total_price =
      (Number(final_row.fix_price) +
        (total_distance - final_row.base_distance_in_km) *
          Number(final_row.km_price)) *
      100

    res.json({ total_price, final_row })
  } catch (error) {
    next(error)
  }
}

export const addPricing = async (req, res, next) => {
  try {
    const {
      organization_id,
      zone,
      item_id,
      base_distance_in_km,
      km_price,
      fix_price,
    } = req.body

    const { rows } = await pool.query(
      `INSERT INTO pricing VALUES (${organization_id},  ${item_id},'${zone}', ${base_distance_in_km}, ${km_price}, ${fix_price}) RETURNING *`
    )

    if (rows.length === 0) {
      throw new ApiError(400, 'Error: unable to add pricing')
    }

    res.json(new ApiResponse(200, rows[0], 'Pricing added successfully'))
  } catch (error) {
    next(error)
  }
}

export const getAllPricing = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pricing')

    res.json(new ApiResponse(200, rows, 'Pricing fetched successfully'))
  } catch (error) {
    next(error)
  }
}

export const deletePricing = async (req, res, next) => {
  try {
    const { organization_id, item_id, zone } = req.body

    const result = await pool.query(
      `DELETE FROM pricing WHERE organization_id = ${organization_id} AND item_id = ${item_id} AND zone = '${zone}' RETURNING *`
    )

    if (result.rows.length === 0) {
      throw new ApiError(404, 'Error: unable to delete pricing')
    }

    res.json(new ApiResponse(200, '', 'Pricing deleted successfully'))
  } catch (error) {
    next(error)
  }
}
