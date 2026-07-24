export interface Auth0PayloadInterface {
  //Identificación del proveedor, ejemplo. "google-oauth2|123456789",
  sub: string;
  'https://servilink.com/email': string;
  'https://servilink.com/email_verified': boolean;
}
