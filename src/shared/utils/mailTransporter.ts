import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export class EmailTransporter {
  private readonly smtpHost: string;
  private readonly smtpPort: number;
  private readonly smtpUser: string;
  private readonly smtpPassword: string;
  private readonly emailFrom: string;
  private readonly emailFromName: string;

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
