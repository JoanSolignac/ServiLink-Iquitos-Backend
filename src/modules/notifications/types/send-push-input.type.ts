export type SendPushInput = {
  fcmTokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
};
