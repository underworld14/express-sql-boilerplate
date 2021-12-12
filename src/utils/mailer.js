import nodemailer from 'nodemailer';

const sendMail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send the email
  await transporter.sendMail({
    from: 'admin@nikahan.id',
    to: options.email,
    subject: options.subject,
    text: options?.message,
    html: options?.html,
  });
};

export default sendMail;
