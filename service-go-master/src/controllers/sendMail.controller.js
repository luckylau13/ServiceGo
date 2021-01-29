const sgMail = require('@sendgrid/mail'); //Mailer library
sgMail.setApiKey(
  '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' // Mailer API key.
);

export const sendPaymentReceipt = (sender, paymentReceipt, receiver) => {
  //Function for sending the payment recepit
  sgMail.send({
    to: receiver, //Receiver email
    from: sender, //Sender email
    subject: 'Payment receipt for booking the service',
    text: `Thanks for booking the service. The link to the payment receipt is ${paymentReceipt}`
  });
};
export const sharePaymentRecepit = (sender, paymentReceipt, receiver) => {
  //Function for sharing the payment recepit
  sgMail.send({
    to: receiver, //Receiver email
    from: sender, //Sender email
    subject: `Payment receipt shared by ${sender}`,
    text: `Payment receipt shared by ${sender}. The link to the payment receipt is ${paymentReceipt}`
  });
};
