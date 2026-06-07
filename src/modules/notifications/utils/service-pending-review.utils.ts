export function buildEmailTemplateServicePendingReview(
  serviceName: string,
  userName: string,
): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Servicio en revisión</title>
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
                      background: linear-gradient(180deg, #2554e8 0%, #1f49d8 100%);
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
                        color: #ff7849;
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
                      ¡Felicitaciones!
                    </h1>

                    <p
                      style="
                        color: rgba(255,255,255,0.9);
                        font-size: 18px;
                        margin-top: 16px;
                        margin-bottom: 0;
                      "
                    >
                      Tu servicio ha sido recibido correctamente.
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
                      Estimado(a) <strong>${userName}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Nos complace informarle que su servicio
                      <strong>"${serviceName}"</strong>
                      ha sido registrado exitosamente en ServiLink.
                    </p>

                    <div
                      style="
                        background: #f8faff;
                        border-left: 4px solid #2554e8;
                        padding: 20px;
                        border-radius: 12px;
                        margin: 30px 0;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          font-size: 15px;
                          line-height: 1.8;
                          color: #374151;
                        "
                      >
                        Actualmente, su publicación se encuentra en
                        <strong>proceso de revisión y aprobación</strong>.
                        Nuestro equipo verificará que cumpla con las normas,
                        políticas y lineamientos de la plataforma.
                      </p>
                    </div>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Este proceso puede tomar entre
                      <strong>24 y 48 horas</strong>.
                      Una vez finalizada la validación, recibirá una
                      notificación informándole el resultado de la revisión.
                    </p>

                    <p
                      style="
                        margin: 0 0 32px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Agradecemos su confianza en ServiLink y su interés en
                      ofrecer servicios de calidad a nuestra comunidad.
                    </p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          style="
                            background: #2554e8;
                            border-radius: 12px;
                          "
                        >
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
