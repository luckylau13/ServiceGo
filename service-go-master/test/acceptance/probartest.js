// module.exports = {
//   "My first test case"(browser) {
//     var emailTextFeild = 'input[name = "email"]';
//     var passwordTextFeild = 'input[name = "password"]';
//     var submitionBtn = ".btn[type=submit]";
//     var bookingHistoryBtn = '.btn[name="bookingHistoryBtn"]';
//     var seeMoreLink =
//       "https://service-go.herokuapp.com/user/history/bookingDetails/5da82cf2a4d4c00004a3c292";
//     browser
//       .url("https://service-go.herokuapp.com/login")
//       .setValue(emailTextFeild, "lucaslau123@gmail.com")
//       .setValue(passwordTextFeild, "lucaslau123")
//       .click(submitionBtn)
//       .pause(500)
//       .click("//*[contains(text(), 'Bookings')]")
//       .pause(500)
//       .url(seeMoreLink)
//       .useXpath()
//       .click("//*[contains(text(), 'In progress')]")
//       .useXpath()
//       .click("//*[contains(text(), 'Logout')]")
//       .end();
//   }
// };
