// Material Select Initialization
let currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
function showTab(n) {
  const x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  if (n === 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n === x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  fixStepIndicator(n);
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  // if (n == 1 && !validateForm()) return false;
  if (n === 1) {
    serverSideValid(n, x);
  } else {
    x[currentTab].style.display = "none";

    currentTab = currentTab + n;

    if (currentTab >= x.length) {
      document.getElementById("regForm").submit();
      return false;
    }

    showTab(currentTab);
  }
}

function serverSideValid(n, x) {
  fetch("/validateDateAndTime", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      date: $("#date").val(),
      time: $("#time").val()
    })
  })
    .then(res => res.json())
    .then(data => {
    
      if (data.length != undefined) {
        data.forEach(error => {
          if (error.param === "date") {
            document.getElementById("date-err").style.display = "block";
          }
        });
      } else {
        document.getElementById("date-err").style.display = "none";
        // document.getElementById("time-err").style.display = "none";

        x[currentTab].style.display = "none";

        currentTab = currentTab + n;

        if (currentTab >= x.length) {
          document.getElementById("regForm").submit();
          return false;
        }

        showTab(currentTab);
      }
    })
    .catch(err => console.log(err));
}
function validateForm() {
  // This function deals with validation of the form fields
  let x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";

      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  let i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length - 1; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}
// const select = document.getElementById("select");
// select.size = select.length;


