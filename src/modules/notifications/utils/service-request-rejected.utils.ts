export function buildEmailTemplateServiceRequestRejected(
  serviceTitle: string,
  recipientName: string,
  rejectedByProvider: boolean,
): string {
  const heading = rejectedByProvider
    ? '¡Tu solicitud fue rechazada!'
    : '¡El cliente no confirmó el servicio!';
  const subtitle = rejectedByProvider
    ? 'El proveedor no pudo atender tu solicitud.'
    : 'El cliente rechazó la confirmación del servicio.';
  const body = rejectedByProvider
    ? `El proveedor rechazó tu solicitud para el servicio <strong>"${serviceTitle}"</strong>. Puedes buscar otro proveedor disponible en ServiLink.`
    : `El cliente rechazó la confirmación del servicio <strong>"${serviceTitle}"</strong>. Si tienes dudas, puedes contactar al equipo de soporte de ServiLink.`;

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Solicitud rechazada</title>
      </head>
      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f7fb;
        font-family: Inter, Arial, Helvetica, sans-serif;
      ">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
          <tr>
            <td align="center">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background: #ffffff;
                  border-radius: 24px;
                  overflow: hidden;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
                      padding: 48px 40px;
                      position: relative;
                    "
                  >
                    <div
                      style="
                        width: 80px;
                        height: 80px;
                        background: #f36f21;
                        border-radius: 50%;
                        position: absolute;
                        top: -20px;
                        right: -20px;
                      "
                    ></div>

                    <p
                      style="
                        color: #fecaca;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 2px;
                        margin: 0 0 40px;
                        text-transform: uppercase;
                      "
                    >
                      SERVILINK · IQUITOS
                    </p>

                    <h1
                      style="
                        color: white;
                        font-size: 40px;
                        line-height: 1.1;
                        margin: 0;
                        font-weight: 800;
                      "
                    >
                      ${heading}
                    </h1>

                    <p
                      style="
                        color: rgba(255,255,255,0.9);
                        font-size: 18px;
                        margin-top: 16px;
                        margin-bottom: 0;
                      "
                    >
                      ${subtitle}
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 16px;
                        color: #1f2937;
                      "
                    >
                      Estimado(a) <strong>${recipientName}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      ${body}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding: 24px 40px;
                      background: #fafafa;
                      border-top: 1px solid #eeeeee;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        color: #9ca3af;
                        text-align: center;
                        line-height: 1.6;
                      "
                    >
                      Este correo fue enviado automáticamente por ServiLink.
                      Por favor, no responda a este mensaje.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
