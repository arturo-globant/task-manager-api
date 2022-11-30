const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "arturo.gascon@globant.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. I hope you find it useful!.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "arturo.gascon@globant.com",
    subject: "We are sad to see you go :´(",
    text: `${name}, we are sad to see you to. Can you tell us why are you leaving or what can we do to keep you as a user?`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
