import type { NextApiRequest, NextApiResponse } from 'next';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        // Initialize MailerSend with your API key from .env
        const mailerSend = new MailerSend({
            apiKey: process.env.NEXT_PUBLIC_MAIL_SENDER_API_KEY as string, // Ensure your API key is set in the .env file
        });

        // Sender information
        const sentFrom = new Sender("jeovejas@gmail.com", "Muhammad Faiz Rasool");

        const recipients = [
            new Recipient("emp.metasolutionspk@gmail.com", "Meta Solutions")
        ];

        // Create email parameters
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            // .setReplyTo(sentFrom)
            .setSubject("This is a Subject")
            .setHtml("<strong>This is the HTML content</strong>")
            .setText("This is the text content");
        // Send the email
        await mailerSend.email.send(emailParams);

        // Send a success response
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email', error });
    }
}
