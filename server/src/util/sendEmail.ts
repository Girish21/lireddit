import { createTransport, getTestMessageUrl } from 'nodemailer';

export async function sendEmail(to: string, html: string) {
  // let testAccount = await createTestAccount();
  // console.log(testAccount);

  let transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'bnb3dj3mm2cyboam@ethereal.email',
      pass: '3w6zev9F7pkPKqKe8w',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: 'Change password',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', getTestMessageUrl(info));
}
