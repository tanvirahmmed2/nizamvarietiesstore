export const generateReceipt = (order) => {
  if (!order) return;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const receiptContent = `
    <html>
      <head>
        <style>
          @page { margin: 0; size: 80mm auto; }
          body { 
            font-family: 'Arial', sans-serif; 
            width: 74mm; 
            margin: 0 auto; 
            padding: 8mm 2mm; 
            /* GLOBAL INCREASE STARTS HERE */
            font-size: 24px; 
            line-height: 1.4;
            color: #000;
            zoom: 1.1; 
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .divider { border-top: 3px solid #000; margin: 15px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { border-bottom: 4px solid #000; text-align: left; padding-bottom: 8px; font-size: 24px; }
          td { padding: 8px 0; vertical-align: top; }
          .qty { width: 15%; }
          .name { width: 50%; }
          .price { width: 35%; text-align: right; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .grand-total { 
            font-size: 32px; /* Extra large for the total */
            margin-top: 15px; 
            border-top: 4px solid #000; 
            padding-top: 15px; 
          }
          .footer-msg { margin-top: 30px; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="center">
          <h2 style="margin:0; font-size: 30px; text-transform: uppercase;">Nizam Varieties Store</h2>
          <p style="margin:8px 0; font-size: 22px;">Tel: 01645-172356</p>
          <div class="divider"></div>
          <p style="margin:8px 0; font-size: 26px;" class="bold">ORDER: #${order.order_id}</p>
          <p style="margin:8px 0;">${new Date(order.created_at || Date.now()).toLocaleString()}</p>
        </div>

        <div style="margin: 25px 0 20px 0;">
          <div>Customer: <span class="bold">${order.name || 'Walk-in'}</span></div>
          <div>Status: <span class="bold">${order.status?.toUpperCase()}</span></div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="qty">Qty</th>
              <th class="name">Item</th>
              <th class="price">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td class="qty">${item.quantity}</td>
                <td class="name">${item.name}</td>
                <td class="price">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="divider"></div>

        <div class="total-section">
          <div class="total-row"><span>Subtotal:</span><span>${Number(order.subtotal_amount).toFixed(2)}</span></div>
          ${order.total_discount_amount > 0 ? `
          <div class="total-row"><span>Discount:</span><span>-${Number(order.total_discount_amount).toFixed(2)}</span></div>` : ''}
          <div class="total-row bold grand-total">
            <span>TOTAL:</span>
            <span>BDT ${Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        <div class="center footer-msg">
          <p style="margin:0;">Payment Mode: ${order.payment_method?.toUpperCase() || 'CASH'}</p>
          <div class="divider" style="border-top-style: dotted; border-width: 2px;"></div>
          <p class="bold" style="font-size: 24px;">Thank you for shopping!</p>
          <p style="font-size: 14px; opacity: 0.8; margin-top: 15px;">Software by Nizam POS</p>
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
  }, 500);
};