import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserReportThresholdReachedEvent } from '@modules/reports/events/user-report-threshold-reached.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateUserWarningReports } from '@modules/notifications/utils/user-warning-reports.utils';

@Injectable()
export class UserReportThresholdReachedHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(UserReportThresholdReachedEvent.name, { async: true })
  async handle(event: UserReportThresholdReachedEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.targetUserName, email: event.targetUserEmail }],
      subject: 'Aviso importante sobre tu cuenta en ServiLink',
      htmlContent: buildEmailTemplateUserWarningReports(event.targetUserName),
    });
  }
}
