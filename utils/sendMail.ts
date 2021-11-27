import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { google } from "googleapis";

const sendMail = async (email: string, subject: string, text: string, html: string) => {
    const { OAuth2 } = google.auth;
    const oauth2Client = new OAuth2(
        process.env.VERIFY_CLIENT_ID, // ClientID
        process.env.VERIFY_CLIENT_SECRET, // Client Secret
        "https://developers.google.com/oauthplayground", // Redirect URL
    );
    oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
    });
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USERNAME,
            clientId: process.env.VERIFY_CLIENT_ID,
            clientSecret: process.env.VERIFY_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });
    const mail: Mail.Options = {
        from: `Classroom <${process.env.GMAIL_USERNAME}>`,
        to: email,
        subject,
        text,
        html,
    };
    transporter.sendMail(mail, (error, info) => {
        if (error) {
            console.error(error);
            throw new Error(error.message);
        } else {
            console.log(`Mail sent: ${info.messageId}`);
        }
    });
};

export default sendMail;
