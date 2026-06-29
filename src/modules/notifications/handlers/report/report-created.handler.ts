import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReportCreatedEvent } from '@modules/reports/events/report-created.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateReportCreatedModerator } from '@modules/notifications/utils/report-created-moderator.utils';
import { buildEmailTemplateReportCreatedReporter } from '@modules/notifications/utils/report-created-reporter.utils';

@Injectable()
export class ReportCreatedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ReportCreatedEvent.name, { async: true })
  async handle(event: ReportCreatedEvent): Promise<void> {
    const tasks: Promise<void>[] = [];

    if (event.moderatorFcmTokens.length > 0) {
      tasks.push(
        this.pushService.send({
          fcmTokens: event.moderatorFcmTokens,
          title: 'Nuevo reporte',
          body: 'Se ha realizado un reporte. Revisa la aplicación para ver los detalles.',
        }),
      );
    }

    if (event.moderatorEmails.length > 0) {
      tasks.push(
        this.emailSend.send({
          to: event.moderatorEmails,
          subject: 'Nuevo reporte pendiente en ServiLink',
          htmlContent: buildEmailTemplateReportCreatedModerator(),
        }),
      );
    }

    if (event.reporterEmail) {
      tasks.push(
        this.emailSend.send({
          to: [{ name: event.reporterName, email: event.reporterEmail }],
          subject: 'Gracias por tu reporte - ServiLink',
          htmlContent: buildEmailTemplateReportCreatedReporter(
            event.reporterName,
          ),
        }),
      );
    }

    await Promise.all(tasks);
  }
}
