module.exports = {
  "Cancelling the customer payment history"(browser) {
    //It is same as the describe in Unit testing.
    var emailTextField = 'input[name = "email"]'; //email field for
    var passwordField = 'input[name = "password"]';
    var submitBtn = '.btn[type="submit"]';
    var paymentHistoryBtn = '.btn[name = "paymentHistoryBtn"]';
    var cancelPayment = '.btn[name = "cancelPayment"]';
    // var displayButton =
    //   '//ul[contains(@class, "nav nav-tabs mb-4") and text()="In Progress"]';
    browser
      .url("http://service-go.herokuapp.com/login") //Url for the Service Go
      .setValue(emailTextField, "luitelpramish7@gmail.com") //email address
      .setValue(passwordField, "hellopramish") //password for the user
      .click(submitBtn) //Clicking the submit button
      .pause(3000) //pause for 3 seconds
      .click(paymentHistoryBtn) //Clicking the Payment history button
      .pause(3000) //pause for 3 seconds
      // .click(cancelPayment) //Clicking the cancel button
      .pause(3000); //pause for 3 seconds
  }
};
