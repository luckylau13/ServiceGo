const showAbout = () => {
  hideAll();
  document.getElementById("about").style.display = "block";
};

const availability = () => {
  hideAll();
  document.getElementById("availability").style.display = "block";
};

//review and star rating
const review = async userId => {
  hideAll();
  console.log("UserId:", userId);
  let res = await fetchReviews(userId);
  document.getElementById("review").style.display = "block";
};

const rate = () => {
  hideAll();
  console.log("Rate clicked");
  document.getElementById("rate").style.display = "block";
};

const bookingDetailsOfCustomer = () => {
  getBookingsById();
  document.getElementById("bookings").style.display = "flex";
};

// Booking Details
const bookingDetails = () => {
  hideAll();
  getBookingsById();
  document.getElementById("bookings").style.display = "flex";
};

const showMainCards = () => {
  document.getElementById("dashboard-details").style.display = "block";
};
const hideMainCards = () => {
  document.getElementById("dashboard-details").style.display = "none";
};

const hideAll = () => {
  hideMainCards();
  document.getElementById("about").style.display = "none";
  document.getElementById("rate").style.display = "none";
  document.getElementById("availability").style.display = "none";
  document.getElementById("bookings").style.display = "none";
  document.getElementById("review").style.display = "none";
};

const getBookingsById = async () => {
  const result = await fetch(`/user/book/getBookings`);
  const data = await result.json();
  const bookings = data.bookings;
  const html = bookings
    .map(
      booking => `
        <tr id="${booking._id}">

          <td>${moment(booking.date).format("dddd, MMMM Do YYYY")}</td>
          <td>${booking.time}</td>
          <td>${booking.status}</td>
          <td>${booking.location}</td>
          <td>${(booking.status = "Not started."
            ? `<button class='btn btn-danger' onclick='cancelBooking("${booking._id}")'>Cancel</button>`
            : "")}</td>
      </tr>
    `
    )
    .join("");

  document.getElementById("showBookings").innerHTML = html;
};

const cancelBooking = async id => {
  $.ajax("/user/book/cancelBooking", {
    type: "POST",
    data: { booking_id: id },
    success: (data, status, xhr) => {
      console.log(data);
      document.getElementById(`${data.id}`).style.display = "none";
    },
    error: () => {}
  });
};
const changeRate = async () => {
  let data = {
    monday: document.getElementById("rate1").value,
    tuesday: document.getElementById("rate2").value,
    wednesday: document.getElementById("rate3").value,
    thursday: document.getElementById("rate4").value,
    friday: document.getElementById("rate5").value,
    saturday: document.getElementById("rate6").value
  };
  $.ajax("/user/rate", {
    type: "POST",
    data: data,
    success: (data, status, xhr) => {
      document.getElementById("show-success-rate").style.display = "block";
      document.getElementById("show-success-rate").innerHTML =
        "Rate Data successfully updated!";
    },
    error: () => {}
  });
};
const changeAvailability = async () => {
  let data = {
    monday: $("#avi1").prop("checked"),
    tuesday: $("#avi2").prop("checked"),
    wednesday: $("#avi3").prop("checked"),
    thursday: $("#avi4").prop("checked"),
    friday: $("#avi5").prop("checked"),
    saturday: $("#avi6").prop("checked")
  };
  $.ajax("/user/avi", {
    type: "POST",
    data: data,
    success: (data, status, xhr) => {
      document.getElementById("show-success").style.display = "block";
      document.getElementById("show-success").innerHTML =
        "Availability Data successfully updated!";
    },
    error: () => {}
  });
};

const fetchReviews = async userId => {
  let response = await fetch(`/review/${userId}`, {
    method: "GET"
  });
  let data = await response.json();

  const html = data
    .map(
      review => `
        <tr id="${review._id}">
          <td>${moment(review.createdAt).format("dddd, MMMM Do YYYY")}</td>
          <td>${review.text}</td>
          <td>${review.stars}</td>
      </tr>
    `
    )
    .join("");

  document.getElementById("reviewdata").innerHTML = html;
};
