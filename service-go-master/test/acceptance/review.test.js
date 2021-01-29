module.exports = {
  "Giving the review for the booked service."(browser) {
    var emailTextField = 'input[name = "email"]';
    var passwordField = 'input[name = "password"]';
    var reviewPost = 'textarea[name = "review"]';
    // var postStar = 'input[name = "5star"]';
    var submitBtn = '.btn[type="submit"]';
    var bookingHistoryBtn = '.btn[name = "bookingHistoryBtn"]';
    var seeMoreBtn = '.btn[id = "seeMoreBtn"]';
    var reviewBtn = '.btn[name = "reviewBtn"]';
    var postBtn = '.btn[name = "postBtn"]';
    // var seeMoreBtn = '//tr[contains(@class, "see") and text()="See More"]';
    browser
      .url("http://service-go.herokuapp.com/login")
      .setValue(emailTextField, "yantolie41@gmail.com")
      .setValue(passwordField, "12345")
      .click(submitBtn)
      .pause(3000)
      .click(bookingHistoryBtn)
      .pause(3000)
      .click(seeMoreBtn)
      .pause(3000)
      .click(reviewBtn)
      .pause(3000)
      .setValue(reviewPost, "This is a good service. I liked it.")
      //   .setValue(postStar);
      .pause(3000)
      .click(postBtn)
      .pause(10000);
  }
};
