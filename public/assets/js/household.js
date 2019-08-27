//SAMPLE HOUSEHOLD
var houseID = 1;
//Big Display Function(Probably need to break it down into seperate functions???)
function houseDisplay() {
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    var rez = response.data;
    var superCard = $("<div class='row cardContainer'>");
    for (var j = 0; j < rez.Users.length; j++) {
      var cardDiv = $("<div class='card bg-light mb-3 col-6' style='max-width: 15rem;'>");
      cardDiv.append(`<div class="card-header">${rez.Users[j].name}</div>`);
      var cardBody = $("<div class='card-body'>");
      var cardTitle = $("<h5 class='card-title>Chores</h5>");
      var cardListDaily = $("<ul>");
      var cardListMonthly = $("<ul>");
      var cardListWeekly = $("<ul>");
      var cardListYearly = $("<ul>");
      cardBody.append(cardTitle);
      for (var z = 0; z < rez.Chores.length; z++) {
        var special = rez.Chores[z];
        if (rez.Users[j].name === special.assignedTo && special.frequency) {
          var intermediate2 = $(`<li class='chore${z}'>${special.name}(${special.frequency})</p>`);
          switch (special.frequency) {
            case "dialy":
              intermediate2.addClass("daily");
              cardListDaily.append(intermediate2);
              break;
            case "weekly":
              intermediate2.addClass("weekly");
              cardListWeekly.append(intermediate2);
              break;
            case "monthly":
              intermediate2.addClass("monthly");
              cardListMonthly.append(intermediate2);
              break;
            case "yearly":
              intermediate2.addClass("yearly");
              cardListYearly.append(intermediate2);
              break;
          }
        }
      }
      cardBody.append(cardListDaily);
      cardBody.append(cardListWeekly);
      cardBody.append(cardListMonthly);
      cardBody.append(cardListYearly);
      cardDiv.append(cardBody);
      superCard.append(cardDiv);
      $(".container").append(superCard);
    }
    // houseHolder.append("</ul>");
    // householdDiv.append(houseHolder);
    // householdDiv.append("<h4> Unassigned Chores </h4>");
    // householdDiv.append(unAssigned);
    // $(".container").append(householdDiv);
    for (var z = 0; z < rez.Chores.length; z++) {
      if (rez.Chores[z].isComplete === true) {
        $(`.chore${z}`).attr("style", "color: green;");
      }
    }
    var hide = false;
    $("#hideComplete").on("click", function() {
      if (hide === false) {
        for (var z = 0; z < rez.Chores.length; z++) {
          if (rez.Chores[z].isComplete === true) {
            $(`.chore${z}`).hide();
          }
          $("#hideComplete").html("Show Completed Chores");
        }
        hide = true;
      } else {
        $("#hideComplete").html("Hide Completed Chores");
        for (var z = 0; z < rez.Chores.length; z++) {
          if (rez.Chores[z].isComplete === true) {
            $(`.chore${z}`).show();
          }
        }
        hide = false;
      }
    });
  });
}

$("#frequencyFilterButton").on("click", function() {
  var test = $("#frequencyFilter").val();
  console.log(test);
  switch (test) {
    case "Daily":
      $(".daily").show();
      $(".weekly").hide();
      $(".monthly").hide();
      $(".yearly").hide();
      break;
    case "Weekly":
      $(".daily").hide();
      $(".weekly").show();
      $(".monthly").hide();
      $(".yearly").hide();
      break;
    case "Monthly":
      $(".daily").hide();
      $(".weekly").hide();
      $(".monthly").show();
      $(".yearly").hide();
      break;
    case "Yearly":
      $(".daily").hide();
      $(".weekly").hide();
      $(".monthly").hide();
      $(".yearly").show();
      break;
    case "all":
      $(".daily").show();
      $(".weekly").show();
      $(".monthly").show();
      $(".yearly").show();
      break;
  }
});

function modalChecks() {
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    var rez = response.data;
    for (var j = 0; j < rez.Users.length; j++) {
      var special = rez.Users[j];
      specialCheck = $(
        `<input type="checkbox" name="assigned" value="${special.name}">${special.name}</input><br>`
      );
      $("#formCheck").append(specialCheck);
    }
  });
}
// function inviteMember() {
//   $.ajax({ url: "api/users", method: "GET" }).then(function(response) {
//     console.log(response.data);
//     var rez = response.data;
//     $.ajax({
//       type: "PUT",
//       url: "api/users/11",
//       data: {
//         HouseholdId: 1
//       }
//     }).then(function(res) {
//       console.log(res.data);
//     });
//     $.ajax({
//       type: "GET",
//       url: "api/users/11"
//     }).then(function(resp) {
//       console.log(resp.data);
//     });
//   });
// }

function choreEdit() {
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var rez = response.data;
    for (var z = 0; z < rez.Chores.length; z++) {
      var intermediate = $(`<option value='${rez.Chores[z].id}'> ${rez.Chores[z].name}</option>`);
      $("#chore-selector").append(intermediate);
    }
    for (var j = 0; j < rez.Users.length; j++) {
      var special = rez.Users[j];
      specialCheck = $(`<option value="${special.name}">${special.name}</option><br>`);
      $("#formCheck").append(specialCheck);
    }
  });
}
$("#submitChore").on("click", function() {
  var choreId = $("#chore-selector").val();
  console.log(choreId);
  var assignee = $("#formCheck").val();
  var newFreq = $("#frequency").val();
  console.log(newFreq);
  var queryURL2 = "api/chores/" + choreId;
  console.log(queryURL2);
  console.log(assignee);
  $.ajax({
    type: "PUT",
    url: queryURL2,
    data: {
      id: choreId,
      assignedTo: assignee,
      frequency: newFreq
    }
  }).then(function(response) {
    console.log(response);
  });
});

$("#modal-body2").hide();
$("#renameChore").on("click", function() {
  $("#modal-body2").show();
  $("#modal-body1").hide();
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var rez = response.data;
    for (var z = 0; z < rez.Chores.length; z++) {
      var intermediate = $(`<option value='${rez.Chores[z].id}'> ${rez.Chores[z].name}</option>`);
      $("#oldChoreName").append(intermediate);
    }
  });
});

$("#backEdit").on("click", function() {
  $("#modal-body1").show();
  $("#modal-body2").hide();
});

$("#nameChanger").on("click", function() {
  var newName = $("#newChoreName")
    .val()
    .trim();
  var id = $("#oldChoreName").val();
  var queryURL = "/api/chores/" + id;
  if (newName === "") {
    console.log("ERR: No new name value.");
  } else {
    $.ajax({
      type: "PUT",
      url: queryURL,
      data: {
        name: newName
      }
    }).then(function(response) {
      console.log(response);
      console.log("Congrats. You've changed the chore's name!");
    });
  }
});
houseDisplay();
modalChecks();
choreEdit();