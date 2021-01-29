const reviewTheProvider = () => {};

//popup
const postReview = async bookingId => {
  let value = document.getElementById("review-text").value;
  let stars = document.getElementById("starsValue").value;
  if (value) {
    Swal.fire({
      title: "Thanks!",
      text: "We really appreciate your reviw.",
      type: "success"
    }).then(async result => {
      console.log("Success", result);
      let data = {
        text: value,
        stars: stars,
        bookingId: bookingId
      };
      let res = await fetch("/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      let dataFromServer = await res.json();
      console.log(dataFromServer);

      // inside .post()
    });
  } else {
    Swal.fire({
      title: "Hey!",
      text: "Please add some review before submitting it!",
      type: "warning",
      cancelButtonText: "Cancel"
    }).then(result => {
      console.log("Fail", result);
    });
  }
};

const starsClickers = value => {
  document.getElementById("starsValue").value = value;
};
