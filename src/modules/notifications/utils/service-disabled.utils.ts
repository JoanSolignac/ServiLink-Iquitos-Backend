export function buildEmailTemplateServiceDisabled(
  userName: string,
  serviceTitle: string,
  disabledUntil: Date | null,
): string {
  const disabledInfo = disabledUntil
    ? `Su servicio estará desactivado hasta el <strong>${disabledUntil.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>.`
    : 'Su servicio ha sido desactivado de manera indefinida.';

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Servicio desactivado</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Inter,Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:linear-gradient(180deg,#d97706 0%,#b45309 100%);padding:48px 40px;">
                    <p style="color:#fde68a;font-size:12px;font-weight:700;letter-spacing:2px;margin:0 0 40px;text-transform:uppercase;">SERVILINK · IQUITOS</p>
                    <h1 style="color:white;font-size:36px;line-height:1.1;margin:0;font-weight:800;">Servicio desactivado</h1>
                    <p style="color:rgba(255,255,255,0.9);font-size:18px;margin-top:16px;margin-bottom:0;">Tu servicio ha sido retirado temporalmente.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:48px 40px;">
                    <p style="margin:0 0 24px;font-size:16px;color:#1f2937;">Estimado(a) <strong>${userName}</strong>,</p>
                    <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
                      Nuestro equipo de moderación ha desactivado tu servicio <strong>"${serviceTitle}"</strong> debido a reportes o incumplimiento de las normas de la plataforma.
                    </p>
                    <div style="background:#fffbeb;border-left:4px solid #d97706;padding:20px;border-radius:12px;margin:30px 0;">
                      <p style="margin:0;font-size:15px;line-height:1.8;color:#374151;">${disabledInfo}</p>
                    </div>
                    <p style="margin:0 0 32px;font-size:16px;line-height:1.8;color:#4b5563;">
                      Durante este periodo, tu servicio no será visible en los resultados de búsqueda. Si consideras que esto es un error, puedes comunicarte con nuestro equipo de soporte.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 40px;background:#fafafa;border-top:1px solid #eeeeee;">
                    <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;line-height:1.6;">Este correo fue enviado automáticamente por ServiLink. Por favor, no responda a este mensaje.</p>
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
