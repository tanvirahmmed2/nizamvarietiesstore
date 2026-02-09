'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'

const AddPurchaseForm = () => {
    const {purchaseItems}= useContext(Context)
    const [formData, setFormdata] = useState({
        supplier_name: '',
        supplier_phone: '',
        invoice_no: '',
        total_amount: '',
        subtotal_amount: '',
        payment_method: '',
        transaction_id: '',
        note: '',
        items: purchaseItems

    })
// create table public.purchases (
//   purchase_id serial not null,
//   supplier_name character varying(200) not null,
//   supplier_phone character varying(20) null,
//   invoice_no character varying(100) null,
//   subtotal_amount numeric(12, 2) not null default 0.00,
//   extra_discount numeric(12, 2) null default 0.00,
//   total_amount numeric(12, 2) not null default 0.00,
//   payment_method character varying(50) not null,
//   transaction_id character varying(100) null,
//   note text null,
//   created_at timestamp without time zone null default CURRENT_TIMESTAMP,
//   constraint purchases_pkey primary key (purchase_id),
//   constraint purchases_invoice_no_key unique (invoice_no)
// ) TABLESPACE pg_default;

// create table public.purchase_items (
//   purchase_id integer not null,
//   product_id integer not null,
//   quantity integer not null,
//   purchase_price numeric(10, 2) not null,
//   constraint purchase_items_pkey primary key (purchase_price),
//   constraint purchase_items_product_id_fkey foreign KEY (product_id) references products (product_id) on delete RESTRICT,
//   constraint purchase_items_purchase_id_fkey foreign KEY (purchase_id) references purchases (purchase_id) on delete CASCADE,
//   constraint purchase_items_quantity_check check ((quantity > 0))
// ) TABLESPACE pg_default;


    const handleChange = async (e) => {
        const { name, value } = e.target
        setFormdata((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div>
                    <label htmlFor="supplier_name">Supplier Name</label>
                    <input type="text" name='supplier_name' id='supplier_name' onChange={handleChange} value={formData.supplier_name} />
                </div>
                <div>
                    <label htmlFor="supplier_phone">Supplier Phone</label>
                    <input type="text" name='supplier_phone' id='supplier_phone' onChange={handleChange} value={formData.supplier_phone}/>
                </div>
            </div>
            <div>
                <div>

                </div>
                <div>
                    <p>{formData.subtotal_amount}</p>
                    <p>{formData.total_amount}</p>
                </div>
            </div>
            <button type='submit'>Purchase</button>
        </form>
    )
}

export default AddPurchaseForm
