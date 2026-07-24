export function buildEmailTemplateReportCreatedModerator(
  reporterName: string,
  subject: string,
  targetName: string,
  reportType: 'SERVICE' | 'USER',
): string {
  const typeLabel =
    reportType === 'SERVICE' ? 'Reporte de servicio' : 'Reporte de usuario';
  const targetLabel =
    reportType === 'SERVICE' ? 'Servicio reportado' : 'Usuario reportado';

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nuevo reporte</title>
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
                  max-width: 600px;
                  width: 100%;
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
                    "
                  >
                    <p
                      style="
                        color: #fde68a;
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
                      Nuevo reporte pendiente
                    </h1>

                    <p
                      style="
                        color: rgba(255,255,255,0.9);
                        font-size: 18px;
                        margin-top: 16px;
                        margin-bottom: 0;
                      "
                    >
                      Requiere revisión del equipo moderador.
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
                      Estimado(a) moderador(a),
                    </p>

                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Se ha recibido un nuevo reporte en la plataforma ServiLink
                      con los siguientes detalles:
                    </p>

                    <!-- Detalles del reporte -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background: #fef2f2;
                        border-left: 4px solid #dc2626;
                        border-radius: 12px;
                        margin: 0 0 32px;
                        overflow: hidden;
                      "
                    >
                      <tr>
                        <td style="padding: 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #fecaca;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 1px;">Tipo</p>
                                <p style="margin: 4px 0 0; font-size: 15px; color: #1f2937; font-weight: 600;">${typeLabel}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #fecaca;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 1px;">${targetLabel}</p>
                                <p style="margin: 4px 0 0; font-size: 15px; color: #1f2937; font-weight: 600;">${targetName}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #fecaca;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 1px;">Reportado por</p>
                                <p style="margin: 4px 0 0; font-size: 15px; color: #1f2937; font-weight: 600;">${reporterName}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 1px;">Asunto</p>
                                <p style="margin: 4px 0 0; font-size: 15px; color: #1f2937;">${subject}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 0 0 32px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Por favor, accede a la aplicación para revisar los detalles
                      completos y tomar las acciones correspondientes.
                    </p>

                    <!-- Botón CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td
                                style="
                                  background: #dc2626;
                                  border-radius: 12px;
                                "
                              >
                                <a
                                  href="#"
                                  style="
                                    display: inline-block;
                                    padding: 14px 32px;
                                    color: #ffffff;
                                    font-size: 15px;
                                    font-weight: 700;
                                    text-decoration: none;
                                    border-radius: 12px;
                                    letter-spacing: 0.5px;
                                  "
                                >
                                  Ver reporte en la app
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
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
