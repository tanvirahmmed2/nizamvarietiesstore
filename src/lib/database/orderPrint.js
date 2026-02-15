export const printOrder = (order) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const receiptContent = `
      <html>
        <head>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
              width: 72mm; margin: 0 auto; padding: 8mm 2mm;
              font-size: 11px; color: #000; line-height: 1.5;
            }
            .header { text-align: center; margin-bottom: 6mm; }
            .brand { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
            .address { font-size: 10px; color: #444; margin: 2px 0; }
            
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 4mm; font-size: 10px; }
            .info-label { color: #666; text-transform: uppercase; font-size: 9px; font-weight: bold; }
            
            .divider { border-top: 1px dashed #000; margin: 4mm 0; }
            .thick-divider { border-top: 2px solid #000; margin: 2mm 0; }

            table { width: 100%; border-collapse: collapse; margin: 2mm 0; }
            th { text-align: left; font-size: 9px; text-transform: uppercase; padding-bottom: 2mm; border-bottom: 1px solid #000; }
            td { padding: 1.5mm 0; vertical-align: top; }
            
            .item-name { font-weight: bold; display: block; word-break: break-word; line-height: 1.2; }
            .item-meta { font-size: 9px; color: #555; }
            
            .totals-container { margin-top: 2mm; }
            .total-row { display: flex; justify-content: space-between; padding: 0.5mm 0; }
            .grand-total { 
              margin-top: 2mm; 
              padding-top: 2mm; 
              border-top: 1px solid #000; 
              font-size: 14px; 
              font-weight: 900; 
            }

            .footer { text-align: center; margin-top: 8mm; }
            .barcode { font-family: 'Libre Barcode 39', cursive; font-size: 30px; margin: 2mm 0; }
            .footer-msg { font-size: 10px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="brand">NIZAM VARIETIES</h1>
            <p class="address">Dhaka, Bangladesh</p>
            <p class="address">Phone: ${order.phone}</p>
          </div>

          <div class="info-grid">
            <div>
                <span class="info-label">Invoice</span><br>
                <span style="font-weight:bold;">#${order.order_id}</span>
            </div>
            <div style="text-align: right;">
                <span class="info-label">Date</span><br>
                <span>${new Date(order.date).toLocaleDateString()} ${new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
          
          <div style="font-size: 10px; margin-bottom: 2mm;">
            <span class="info-label">Customer:</span> ${order.name}
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 60%">Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 25%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.product_list?.map(item => `
                <tr>
                  <td>
                    <span class="item-name">${item.name}</span>
                    <span class="item-meta">@৳${parseFloat(item.price).toFixed(2)}</span>
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right; font-weight: bold;">৳${(parseFloat(item.price) * item.quantity).toFixed(0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="divider"></div>

          <div class="totals-container">
            <div class="total-row">
              <span>Subtotal</span>
              <span>৳${parseFloat(order.subtotal || 0).toFixed(2)}</span>
            </div>
            
            ${order.discount > 0 ? `
            <div class="total-row">
              <span>Discount</span>
              <span>-৳${parseFloat(order.discount).toFixed(2)}</span>
            </div>` : ''}

            <div class="total-row grand-total">
              <span>NET TOTAL</span>
              <span>৳${parseFloat(order.total_amount).toFixed(0)}</span>
            </div>

            <div class="total-row" style="margin-top: 2mm; font-size: 10px;">
              <span>Payment (${order.payment_method?.toUpperCase() || 'CASH'})</span>
              <span>৳${parseFloat(order.amount_received || 0).toFixed(2)}</span>
            </div>
            
            <div class="total-row" style="font-size: 10px;">
              <span>Change</span>
              <span>৳${parseFloat(order.change_amount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <div class="thick-divider"></div>
            <p class="footer-msg">Thank you for your business!</p>
            <p style="font-size: 8px; color: #888; margin-top: 2mm;">Software by YourBrand</p>
          </div>
        </body>
      </html>
    `;

    const pri = iframe.contentWindow;
    pri.document.open();
    pri.document.write(receiptContent);
    pri.document.close();

    // Use a slightly longer timeout for font rendering
    setTimeout(() => {
      pri.focus();
      pri.print();
      document.body.removeChild(iframe);
    }, 800);
}