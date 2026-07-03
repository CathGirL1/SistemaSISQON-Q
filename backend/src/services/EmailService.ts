import nodemailer from "nodemailer";

export class EmailService {

    private transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {

            user: process.env.EMAIL_USUARIO,
            pass: process.env.EMAIL_PASSWORD

        }

    });

    public async enviarCodigoVerificacion(
        gmail: string,
        codigoVerificacion: string
    ) {

        await this.transporter.sendMail({

            from: process.env.EMAIL_USUARIO,

            to: gmail,

            subject: "Código de verificación - SISCON-Q",

            html: `
                <h2>SISCON-Q</h2>

                <p>Hola.</p>

                <p>Tu código de verificación es:</p>

                <h1>${codigoVerificacion}</h1>

                <p>Este código tiene una validez de 10 minutos.</p>

                <p>Si no solicitaste este código, podés ignorar este correo.</p>
            `

        });

    }

}