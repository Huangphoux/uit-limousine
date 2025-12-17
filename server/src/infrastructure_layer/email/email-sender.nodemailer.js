export class EmailSenderNodemailer {
    constructor(client) {
        this.client = client;
    }

    async sendResetPassword(email, link) {
        this.client.sendMail({
            to: email,
            subject: "Reset your password",
            html: `
                <p>You requested a password reset</p>
                <a href="${link}">Reset Password</a>
                <p>This link expires in 15 minutes.</p>
            `
        });
    }
}