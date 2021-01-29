module.exports = {
  "Showing the profile of service provider"(browser) {
    var emailTextField = 'input[name = "email"]';
    var passwordField = 'input[name = "password"]';
    var submitBtn = '.btn[type="submit"]';
    var bookingBtn = '.btn[name = "bookingBtn"]';
    var searchField = "#type";

    browser
      .url("http://service-go.herokuapp.com/login")
      .setValue(emailTextField, "610420737p@gmail.com")
      .setValue(passwordField, "12345")
      .click(submitBtn)
      .pause(3000)
      .click(bookingBtn)
      .pause(3000)
      .setValue(searchField, "cleaner")
      .pause(3000)
      .click(".card-body.mb-1")
      .pause(3000)
      .click(".each-profile:first-child")
      .pause(3000);
  }
};
