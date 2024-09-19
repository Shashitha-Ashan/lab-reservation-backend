const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
});

const sendConfirmationEmail = async (userEmail, token) => {
  mg.messages
    .create("sandbox-123.mailgun.org", {
      from: "Lab Lecture hall Reservation <noreply@llrs.com>",
      to: [`${userEmail}`],
      subject: "Confirm your Email Address",
      text: "Confirm your email",
      html: `
      <h1>Welcome!</h1>
      <p>Please confirm your email by clicking the link below:</p>
      <a href="${process.env.BASE_URL}/confirm/${token}">Confirm Email</a>
    `,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.error(err)); // logs any error
};
const sendRescheduleCancellationEmail = async (userEmail, token) => {
  mg.messages
    .create("sandbox-123.mailgun.org", {
      from: "Lab Lecture hall Reservation <noreply@llrs.com>",
      to: [`${userEmail}`],
      subject: "Reschedule/Cancellation Email",
      text: "Reschedule/Cancellation email",
      html: ` `,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.error(err)); // logs any error
};

module.exports = { sendConfirmationEmail, sendRescheduleCancellationEmail };
