const statusBtnHandler = async (btnName, id) => {
  document.getElementById("statusText").innerHTML = btnName;
  //   Save btn Value to DB
  //   /user/book/id
  let response = await fetch(`/user/book/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: btnName })
  });
  let data = await response.json();
  console.log(data);

  switch (data.status) {
    case "Just Started":
      document
        .getElementById("progressbar")
        .classList.remove("progress-not", "progress-in", "progress-comp");
      document.getElementById("progressbar").classList.add("progress-just");

      break;
    case "In Progress":
      document
        .getElementById("progressbar")
        .classList.remove("progress-not", "progress-just", "progress-comp");
      document.getElementById("progressbar").classList.add("progress-in");
      break;

    case "Completed":
      document
        .getElementById("progressbar")
        .classList.remove("progress-not", "progress-in", "progress-just");
      document.getElementById("progressbar").classList.add("progress-comp");
      break;

    default:
      document
        .getElementById("progressbar")
        .classList.remove("progress-just", "progress-in", "progress-comp");
      document.getElementById("progressbar").classList.add("progress-not");
      break;
  }
};

function progressbar() {


  let status = document.getElementById("statusText").innerHTML;
  console.log(status);

  switch (status) {
    case "Just Started":
      document.getElementById("progressbar").classList.add("progress-just");
      break;
    case "In Progress":
      document.getElementById("progressbar").classList.add("progress-in");
      break;

    case "Completed":
      document.getElementById("progressbar").classList.add("progress-comp");
      break;

    default:
      document.getElementById("progressbar").classList.add("progress-not");
      break;
  }
}

progressbar();


