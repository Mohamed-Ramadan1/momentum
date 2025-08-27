/**
 * Interface for an email transporter service.
 * Defines methods for sending emails.
 */
export interface IEmailTransporter {
  /**
   * Sends an email to the specified recipient.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param text - The plain text body of the email.
   * @param html - The HTML body of the email (optional).
   * @returns A promise that resolves when the email is sent successfully.
   */
  sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void>;
}
