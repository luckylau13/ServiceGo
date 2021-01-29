function onClickWho() {
  checkValue = $("#who").prop("checked");
  console.log(checkValue);
  if (checkValue) {
    $(".sp-section").show();
  } else {
    $(".sp-section").hide();
  }
}

function submitCreateProfile() {
  $("#createProfileForm").validate({
    rules: {
      phone: {
        required: true,
        digits: true
      },
      postcode: {
        digits: true
      }
    }
  });
}

function deleteMyProfile(email) {
  $.ajax({
    url: '/user/profiles',
    type: 'DELETE',
    data: {
      email: email
    },
    success: function (result) {
      if (result === 'success') {
        window.location.href = '/user/dashboard';
      }
    }
  });
}
