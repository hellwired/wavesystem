'use client';

import React from 'react';

interface TicketProps {
    data: {
        shopName: string;
        orderId: number;
        date: string;
        items: {
            description: string;
            quantity: number;
            price: number;
            subtotal: number;
        }[];
        total: number;
        paymentMethod: string;
        cashierName?: string;
    };
}

export default function Ticket({ data }: TicketProps) {
    return (
        <div className="hidden print:block print:w-[80mm] print:p-2 print:text-black">
            <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto; /* Adjust for 80mm paper */
          }
          body {
            background: white;
            color: black;
          }
          /* Hide everything else */
          body > *:not(.print-area) {
            display: none;
          }
          .print-area {
            display: block;
            width: 100%;
          }
        }
      `}</style>

            <div className="print-area font-mono text-xs">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-lg font-bold uppercase">{data.shopName}</h1>
                    <p>Ticket #{data.orderId}</p>
                    <p>{data.date}</p>
                    {data.cashierName && <p>Cajero: {data.cashierName}</p>}
                </div>

                {/* Separator */}
                <div className="border-b border-black border-dashed mb-2" />

                {/* Items */}
                <div className="flex flex-col gap-1 mb-4">
                    {data.items.map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="font-bold">{item.description}</span>
                            <div className="flex justify-between">
                                <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                                <span>${item.subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Separator */}
                <div className="border-b border-black border-dashed mb-2" />

                {/* Totals */}
                <div className="flex justify-between font-bold text-sm mb-1">
                    <span>TOTAL</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs mb-4">
                    <span>Pago ({data.paymentMethod})</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] mt-4">
                    <p>¡Gracias por su compra!</p>
                    <p>Documento no válido como factura</p>
                </div>
            </div>
        </div>
    );
}
