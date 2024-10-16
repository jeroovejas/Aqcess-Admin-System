import { NextResponse } from 'next/server';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

export async function GET(req: Request) {
    if (req.method === 'GET') {
        // Process a POST request
        try {
            // Initialize MailerSend with your API key from .env
            const mailerSend = new MailerSend({
                apiKey: process.env.MAIL_SENDER_API_KEY as string, // Ensure your API key is set in the .env file
            });
            console.log(process.env.MAIL_SENDER_API_KEY)
            // Sender information
            const sentFrom = new Sender("jeovejas@gmail.com", "Muhammad Faiz Rasool");

            const recipients = [
                new Recipient("rasoolf796@gmail.com", "Meta Solutions")
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
            const success = await mailerSend.email.send(emailParams);
            if(success){
                return NextResponse.json({ message: 'Email sent successfully' });
            }
        } catch (error) {
            console.error('Error sending email:', error);
            return NextResponse.json({ message: 'Failed to send email', error });
        }
    } else {
        return NextResponse.json({ message: 'method not applicable' });
    }
}
