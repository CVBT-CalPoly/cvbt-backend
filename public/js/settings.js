$(document).ready( function () {
  var user;
  $.getJSON("api/user_data", function(data) {
    // Make sure the data contains the username as expected before using it
    if (data.hasOwnProperty('username')) {
      user = data.username.username;
    }
  });

  $('#add-button').on('click', function() {
    var shareTo = document.getElementById("newuser").value;
    var addition = [user, shareTo];

    $.ajax({
      "url": "http://localhost:3000/api/settings/share/add",
      "type": "POST",
      "data": JSON.stringify({"add": addition}),
      error: function(xhr, status, errorThrown) {
        alert(xhr.responseText);
      },
      success: function(result) {
        console.log(result);
      }
    });
  });

  $('#newuser').keyup(function(){
    if($(this).val().length !== 0) {
      $('#add-button').attr('disabled', false);
    }
    else {
      $('#add-button').attr('disabled',true);
    }
  });
});