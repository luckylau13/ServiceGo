// Senario
/**
 * As a user,
 * I have already registered my account
 * I need login with my email and password
 * And after I login, I want to see my booking history
 * I already did booking before (with this scenario)
 */

// The login page should show the email and password textfield
// The login page should accept my email and password because I already signed up and it is stored in database
// The booking history page should show some tabs
// User can click the tabs and it should show the relevant booking history relevant with the tabs

module.exports = {
  "Showing the Booking History List"(browser) {
    var emailTextField = 'input[name = "email"]';
    var passwordField = 'input[name = "password"]';
    var submitBtn = '.btn[type="submit"]';
    var bookingHistoryBtn = '.btn[name = "bookingHistoryBtn"]';
    var inProgressTab =
      '//ul[contains(@class, "nav nav-tabs mb-4") and text()="In Progress"]';
    browser
      .url("http://service-go.herokuapp.com/login")
      .setValue(emailTextField, "yantolie41@gmail.com")
      .setValue(passwordField, "12345")

      .click(submitBtn)
      .pause(3000)
      .click(bookingHistoryBtn)
      .pause(3000)
      .useXpath()
      .click("//a[normalize-space()='In Progress']")
      .pause(3000)
      .click("//a[normalize-space()='Completed']")
      .pause(3000)
      .click("//a[normalize-space()='Cancelled']")
      .pause(3000);
  }
};
