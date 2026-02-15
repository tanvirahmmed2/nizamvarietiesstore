export const generateReceipt = (order) => {
  if (!order) return;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const receiptContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
          @page { margin: 0; size: 80mm auto; }
          body { 
            font-family: 'Inter', sans-serif; 
            width: 72mm; margin: 0 auto; padding: 6mm 2mm; 
            font-size: 11px; color: #000; line-height: 1.4; 
          }
          .center { text-align: center; }
          .bold { font-weight: 800; }
          .uppercase { text-transform: uppercase; }
          
          /* Header */
          .store-name { font-size: 20px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
          .store-info { font-size: 10px; color: #444; margin: 1px 0; }
          
          /* Dividers */
          .divider { border-top: 1px dashed #000; margin: 4mm 0; }
          .thick-divider { border-top: 2px solid #000; margin: 2mm 0; }

          /* Info Section */
          .info-grid { display: flex; justify-content: space-between; margin-bottom: 3mm; }
          .label { font-size: 9px; text-transform: uppercase; color: #666; font-weight: 600; display: block; }

          /* Table */
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-size: 9px; text-transform: uppercase; border-bottom: 1px solid #000; padding: 2mm 0; }
          .item-row td { padding: 2mm 0 0.5mm 0; }
          .item-name { font-weight: 700; font-size: 11px; display: block; }
          .item-meta { font-size: 9px; color: #555; }

          /* Totals */
          .totals-section { margin-top: 4mm; }
          .total-row { display: flex; justify-content: space-between; padding: 0.5mm 0; font-size: 11px; }
          .grand-total { 
            margin-top: 2mm; padding-top: 2mm; border-top: 1px solid #000;
            font-size: 16px; font-weight: 800;
          }
          .payment-box { background: #f4f4f4; padding: 2mm; margin-top: 3mm; border-radius: 1mm; }

          .footer { text-align: center; margin-top: 8mm; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="center">
          <h1 class="store-name uppercase">Nizam Varieties Store</h1>
          <p class="store-info">123 Market Street, Dhaka, Bangladesh</p>
          <p class="store-info">Tel: 01645-172356</p>
        </div>

        <div class="divider"></div>

        <div class="info-grid">
          <div>
            <span class="label">Invoice No</span>
            <span class="bold">#${order.order_id}</span>
          </div>
          <div style="text-align: right;">
            <span class="label">Date</span>
            <span>${new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        <div style="margin-bottom: 4mm;">
          <span class="label">Customer</span>
          <span class="bold">${order.name || 'Walk-in Customer'}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 55%">Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 30%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr class="item-row">
                <td>
                  <span class="item-name">${item.name}</span>
                  <span class="item-meta">@${Number(item.price).toFixed(2)} ${item.discount > 0 ? `(Disc: -${item.discount})` : ''}</span>
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;" class="bold">${(item.price * item.quantity - (item.discount || 0)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="thick-divider"></div>

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${Number(order.subtotal_amount).toFixed(2)}</span>
          </div>
          
          ${order.total_discount_amount > 0 ? `
          <div class="total-row" style="color: #c00;">
            <span>Discount</span>
            <span>-${Number(order.total_discount_amount).toFixed(2)}</span>
          </div>` : ''}

          <div class="total-row grand-total">
            <span>TOTAL</span>
            <span>BDT ${Number(order.total_amount).toFixed(2)}</span>
          </div>

          <div class="payment-box">
            <div class="total-row">
              <span>Paid (${order.payment_method?.toUpperCase() || 'CASH'})</span>
              <span>${Number(order.paid_amount || 0).toFixed(2)}</span>
            </div>
            <div class="total-row" style="margin-top: 1mm;">
              <span class="bold">Change Due</span>
              <span class="bold">${Number(order.change_amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p class="bold uppercase">Thank you for shopping!</p>
          <p>Goods once sold are not returnable.</p>
          <div class="divider" style="border-top-style: dotted;"></div>
          <p style="font-size: 8px; opacity: 0.6;">Software by Nizam POS</p>
        </div>
      </body>
    </html>
  `;

  const pri = iframe.contentWindow;
  pri.document.open();
  pri.document.write(receiptContent);
  pri.document.close();

  // 800ms allows Google Fonts to load before printing
  setTimeout(() => {
    pri.focus();
    pri.print();
    document.body.removeChild(iframe);
  }, 800);
};