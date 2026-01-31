import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req) {
    try {
        const formData = await req.formData();
        
        const name = formData.get("name");
        const description = formData.get('description');
        const category_id = parseInt(formData.get('categoryId'));
        const brand_id = formData.get('brandId') ? parseInt(formData.get('brandId')) : null;
        const barcode = formData.get('barcode');
        const unit = formData.get('unit');
        const stock = parseInt(formData.get('stock')) || 0;
        
        const purchase_price = parseFloat(formData.get('purchasePrice'));
        const sale_price = parseFloat(formData.get('salePrice'));
        const discount_price = parseFloat(formData.get('discountPrice')) || 0;
        const wholesale_price = parseFloat(formData.get('wholeSalePrice'));
        const retail_price = parseFloat(formData.get('retailPrice')) || 0;
        const dealer_price = parseFloat(formData.get('dealerPrice')) || 0;

        const imageFile = formData.get('image');

        if (!name || !category_id || !barcode || !unit || isNaN(purchase_price) || isNaN(sale_price)) {
            return NextResponse.json({
                success: false, message: 'Please provide all required fields'
            }, { status: 400 });
        }

        const slug = slugify(name.trim(), { lower: true, strict: true });

        const isExists = await pool.query(`SELECT product_id FROM products WHERE slug=$1 OR barcode=$2`, [slug, barcode]);
        if (isExists.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Product name or Barcode already exists'
            }, { status: 400 });
        }

        if (!imageFile) {
            return NextResponse.json({ success: false, message: 'Please add image' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "nizamvarietiesstore" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(imageBuffer);
        });

        const query = `
            INSERT INTO products (
                name, description, category_id, brand_id, slug, barcode, unit, 
                stock, purchase_price, sale_price, discount_price, 
                wholesale_price, retail_price, dealer_price, image, image_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
            RETURNING *`;

        const values = [
            name, description, category_id, brand_id, slug, barcode, unit,
            stock, purchase_price, sale_price, discount_price,
            wholesale_price, retail_price, dealer_price, 
            cloudImage.secure_url, cloudImage.public_id
        ];

        const newProduct = await pool.query(query, values);

        if (newProduct.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to add product'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true, message: 'Successfully added product'
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message 
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data= await pool.query(`SELECT * FROM products ORDER BY created_at DESC`)
        const result= data.rows
        if(!result || result.length===0){
            return NextResponse.json({
                success:false, message:'No product found'
            },{status:400})
        }

        return NextResponse.json({
            success: true,
             message:'Successfully fetched data',
             payload: result
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}