export const printOrder = (order) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const receiptContent = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            @page { margin: 0; size: 80mm auto; }
            body { 
              font-family: 'Inter', sans-serif; 
              width: 72mm; margin: 0 auto; padding: 6mm 2mm;
              font-size: 11px; color: #000; line-height: 1.4;
            }
            
            /* Header Section */
            .header { text-align: center; margin-bottom: 5mm; }
            .brand { font-size: 22px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
            .store-detail { font-size: 10px; color: #333; margin: 1px 0; }
            
            /* Info Grid */
            .info-section { 
              display: flex; justify-content: space-between; 
              margin-bottom: 3mm; border-bottom: 1px solid #eee; padding-bottom: 2mm;
            }
            .label { font-size: 8px; font-weight: 700; text-transform: uppercase; color: #666; display: block; }
            .value { font-size: 10px; font-weight: 600; }

            /* Table Styling */
            table { width: 100%; border-collapse: collapse; margin-top: 2mm; }
            th { 
              text-align: left; font-size: 9px; text-transform: uppercase; 
              padding: 2mm 0; border-bottom: 1.5px solid #000; 
            }
            .td-item { padding: 3mm 0 1mm 0; }
            .item-name { font-weight: 700; font-size: 11px; display: block; }
            .item-sub { font-size: 9px; color: #555; }
            
            /* Dividers */
            .dashed-line { border-top: 1px dashed #ccc; margin: 3mm 0; }
            .thick-line { border-top: 2px solid #000; margin: 1mm 0; }

            /* Totals Section */
            .totals-area { margin-top: 2mm; }
            .row { display: flex; justify-content: space-between; padding: 0.8mm 0; }
            .grand-total { 
              margin-top: 2mm; padding: 2mm 0; 
              border-top: 1px solid #000; border-bottom: 1px solid #000;
              font-size: 16px; font-weight: 900; 
            }
            .payment-info { background: #f9f9f9; padding: 2mm; margin-top: 2mm; border-radius: 1mm; }

            .footer { text-align: center; margin-top: 10mm; }
            .thanks { font-weight: 700; font-size: 12px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="brand">NIZAM VARIETIES</h1>
            <p class="store-detail">House 12, Road 5, Sector 7, Uttara, Dhaka</p>
            <p class="store-detail">Phone: ${order.phone || '01645-172356'}</p>
          </div>

          <div class="info-section">
            <div>
              <span class="label">Invoice No</span>
              <span class="value">#${order.order_id}</span>
            </div>
            <div style="text-align: right;">
              <span class="label">Date & Time</span>
              <span class="value">${new Date(order.date || Date.now()).toLocaleDateString()} ${new Date(order.date || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>

          <div style="margin-bottom: 4mm;">
            <span class="label">Customer Details</span>
            <span class="value">${order.name || 'Walk-in Customer'}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%">Item Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 35%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.product_list?.map(item => `
                <tr>
                  <td class="td-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-sub">Price: ৳${parseFloat(item.price).toFixed(2)}</span>
                    ${item.discount > 0 ? `<span class="item-sub" style="color:red;"> (Disc: -৳${item.discount})</span>` : ''}
                  </td>
                  <td style="text-align: center; vertical-align: middle;">${item.quantity}</td>
                  <td style="text-align: right; vertical-align: middle; font-weight: 700;">
                    ৳${(parseFloat(item.price) * item.quantity - (item.discount || 0)).toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-area">
            <div class="row">
              <span class="value">Sub-Total</span>
              <span class="value">৳${parseFloat(order.subtotal || 0).toFixed(2)}</span>
            </div>
            
            ${order.discount > 0 ? `
            <div class="row" style="color: #d32f2f;">
              <span class="value">Total Discount</span>
              <span class="value">-৳${parseFloat(order.discount).toFixed(2)}</span>
            </div>` : ''}

            <div class="row grand-total">
              <span>NET TOTAL</span>
              <span>৳${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>

            <div class="payment-info">
              <div class="row" style="font-size: 10px;">
                <span>Total Received (${order.payment_method?.toUpperCase() || 'CASH'})</span>
                <span class="value">৳${parseFloat(order.amount_received || 0).toFixed(2)}</span>
              </div>
              <div class="row" style="font-size: 11px; margin-top: 1mm;">
                <span class="label" style="color:#000; font-size:10px;">Change Due</span>
                <span class="value" style="font-size: 12px;">৳${parseFloat(order.change_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="dashed-line"></div>
            <p class="thanks">Thank You!</p>
            <p class="store-detail">Exchange within 7 days with receipt</p>
            <p style="font-size: 8px; color: #999; margin-top: 4mm;">Powered by Nizam POS System</p>
          </div>
        </body>
      </html>
    `;

    const pri = iframe.contentWindow;
    pri.document.open();
    pri.document.write(receiptContent);
    pri.document.close();

    setTimeout(() => {
        pri.focus();
        pri.print();
        document.body.removeChild(iframe);
    }, 1000);
}