import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { IEmailTransporter } from "../interfaces/index";
import { injectable } from "inversify";

dotenv.config();

/**
 * A class for sending emails using the nodemailer library.
 * Configures SMTP settings from environment variables and provides methods to send emails.
 */

@injectable()
export class EmailTransporter implements IEmailTransporter {
  /**
   * The SMTP host for sending emails.
   */
  private readonly smtpHost: string;

  /**
   * The SMTP port for sending emails.
   */
  private readonly smtpPort: number;

  /**
   * The SMTP user for authentication.
   */
  private readonly smtpUser: string;

  /**
   * The SMTP password for authentication.
   */
  private readonly smtpPassword: string;

  /**
   * The email address used as the sender.
   */
  private readonly emailFrom: string;

  /**
   * The display name for the sender's email.
   */
  private readonly emailFromName: string;

  /**
   * Creates an instance of EmailTransporter and initializes SMTP settings from environment variables.
   * @throws Error if required environment variables (EMAIL_USER, EMAIL_PASSWORD) are not defined.
   */
  constructor() {
    this.smtpHost = process.env.EMAIL_HOST ?? "smtp.gmail.com";
    this.smtpPort = parseInt(process.env.EMAIL_PORT ?? "587", 10);
    this.smtpUser =
      process.env.EMAIL_USER ??
      (() => {
        throw new Error("EMAIL_USER is not defined");
      })();
    this.smtpPassword =
      process.env.EMAIL_PASSWORD ??
      (() => {
        throw new Error("EMAIL_PASSWORD is not defined");
      })();
    this.emailFrom = process.env.EMAIL_FROM ?? this.smtpUser;
    this.emailFromName = process.env.EMAIL_FROM_NAME ?? "Momentum Platform";
  }

  /**
   * Creates a nodemailer transporter instance with the configured SMTP settings.
   * @returns A nodemailer Transporter object for sending emails.
   */
  private createMailTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      auth: {
        user: this.smtpUser,
        pass: this.smtpPassword,
      },
    });
  }

  /**
   * Sends an email to the specified recipient.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param text - The plain text body of the email.
   * @param html - The HTML body of the email (optional).
   * @returns A promise that resolves when the email is sent successfully.
   * @throws Error if the email sending fails.
   */
  public async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    const transporter = this.createMailTransporter();
    const mailOptions = {
      from: `"${this.emailFromName}" <${this.emailFrom}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
