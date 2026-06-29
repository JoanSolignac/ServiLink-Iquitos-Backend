import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReportReviewedEvent } from '@modules/reports/events/report-reviewed.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateReportReviewed } from '@modules/notifications/utils/report-reviewed.utils';

@Injectable()
export class ReportReviewedHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(ReportReviewedEvent.name, { async: true })
  async handle(event: ReportReviewedEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.reporterName, email: event.reporterEmail }],
      subject: 'Tu reporte ha sido revisado - ServiLink',
      htmlContent: buildEmailTemplateReportReviewed(event.reporterName),
    });
  }
}
