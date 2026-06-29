export function buildEmailTemplateUserWarningReports(userName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aviso importante sobre tu cuenta</title>
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
                      background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
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
                        font-size: 36px;
                        line-height: 1.1;
                        margin: 0;
                        font-weight: 800;
                      "
                    >
                      Aviso importante sobre tu cuenta
                    </h1>

                    <p
                      style="
                        color: rgba(255,255,255,0.9);
                        font-size: 18px;
                        margin-top: 16px;
                        margin-bottom: 0;
                      "
                    >
                      Hemos detectado múltiples reportes en tu perfil.
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
                      Nos ponemos en contacto contigo para informarte que tu cuenta
                      ha acumulado más de <strong>5 reportes</strong> por parte de
                      otros usuarios de la plataforma ServiLink. Esto es una señal
                      de alerta que toma muy en serio nuestro equipo moderador.
                    </p>

                    <div
                      style="
                        background: #fffbeb;
                        border-left: 4px solid #d97706;
                        padding: 20px;
                        border-radius: 12px;
                        margin: 30px 0;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 12px;
                          font-size: 15px;
                          font-weight: 700;
                          color: #92400e;
                        "
                      >
                        Consejos para mejorar tu experiencia en ServiLink:
                      </p>
                      <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 2;">
                        <li><strong>Sé transparente</strong> con tus servicios: describe con exactitud lo que ofreces, los precios y los plazos de entrega.</li>
                        <li><strong>Cumple lo que prometes</strong>: si acordaste algo con un cliente, honra ese compromiso.</li>
                        <li><strong>Mantén una comunicación clara</strong>: responde a tiempo y con respeto a quienes te contacten.</li>
                        <li><strong>Actualiza tu perfil</strong>: asegúrate de que tu información de contacto y descripción estén vigentes y sean verídicas.</li>
                        <li><strong>Resuelve los conflictos</strong> de manera amigable y profesional antes de que escalen.</li>
                      </ul>
                    </div>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Si continúas acumulando reportes, nuestro equipo se verá en
                      la necesidad de revisar el estado de tu cuenta y tomar las
                      medidas correspondientes según nuestras políticas de comunidad.
                    </p>

                    <p
                      style="
                        margin: 0 0 32px;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #4b5563;
                      "
                    >
                      Confiamos en que podrás mejorar tu desempeño en la plataforma.
                      ServiLink es un espacio construido sobre la confianza mutua,
                      y queremos que seas parte positiva de esa comunidad.
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
