import { pool } from '@/lib/database/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { name } = await req.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Please add category name' },
        { status: 400 }
      )
    }

    const existCat = await pool.query(
      'SELECT 1 FROM categories WHERE name = $1',
      [name.trim()]
    )

    if (existCat.rowCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Category already exists' },
        { status: 409 }
      )
    }

    const newCat = await pool.query(
      'INSERT INTO categories(name) VALUES($1) RETURNING *',
      [name.trim()]
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added category',
        data: newCat.rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}




export async function GET() {
  try {
    const data = await pool.query('SELECT * FROM categories ORDER BY created_at DESC')
    const result = data.rows || []

    return NextResponse.json({
      success: true,
      message: result.length > 0 ? 'Successfully fetched data' : 'No categories found',
      payload: result
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false, message: error.message
    }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { id, name } = await req.json()

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      )
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Please provide category name' },
        { status: 400 }
      )
    }

    const catName = name.trim()

    const existCat = await pool.query(
      'SELECT 1 FROM categories WHERE LOWER(name) = LOWER($1) AND category_id != $2',
      [catName, id]
    )

    if (existCat.rowCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    const updatedCat = await pool.query(
      'UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *',
      [catName, id]
    )

    if (updatedCat.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully updated category',
        data: updatedCat.rows[0],
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({
        success: false, message: 'ID not received'
      }, { status: 400 })
    }
    const result = await pool.query(`DELETE FROM categories WHERE category_id = $1 RETURNING *`, [id])

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false, message: 'Failed to delete category'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true, message: 'Successfully deleted category'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false, message: error.message
    }, { status: 500 })
  }
}