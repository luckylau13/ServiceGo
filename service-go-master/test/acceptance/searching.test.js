/**
 * As a user,
 * Given I found the searching page,
 * I want to fill in type of service provider
 * And get the list of provider listed so that I can choose one for booking
 */

let URL = "http://service-go.herokuapp.com";
const testSearching = browser => {
  browser
    .url(`${URL}/search`)
    .click("label[for = 'togglemap']")
    .setValue("input[name ='type']", "Cleaner")
    .pause(3000)
    .assert.containsText("#Cleaner", "Cleaner")
    .click("h4[id='Cleaner']")
    .pause(2000)
    .execute(function() {
      console.log(document.getElementById("gmimap1"));
    })
    .pause(1000)
    .end();
};

module.exports = {
  after: function(browser, done) {
    done();
  },
  "@tags": ["Searching"],
  "As a customer, I should be able to search the service provider.": testSearching
};
