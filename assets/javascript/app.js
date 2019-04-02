var trainName = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;

// refreshes minutes till train every second
function currentTime() {
    var current = moment().format('LT');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};


//button for adding train info

$(function () {
    $("#add-train-info-btn").on("click", function (event) {
        event.preventDefault();

        if ($("#train-name-input").val().trim() === "" ||
            $("#destination-input").val().trim() === "" ||
            $("#first-train-time-input").val().trim() === "" ||
            $("#frequency-input").val().trim() === "") {

            alert("Please fill in all input fields");

        } else {
            //gets user input
            var trainName = $("#train-name-input").val().trim();
            var destination = $("#destination-input").val().trim();
            var firstTrainTime = $("#first-train-time-input").val().trim();
            var frequency = $("#frequency-input").val().trim();

            // create local temp object for holding info
            var newTrain = {
                name: trainName,
                destination: destination,
                time: firstTrainTime,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            };

            //uploads train data to database
            database.ref().push(newTrain);

            //log to console
            console.log(newTrain.name);
            console.log(newTrain.destination);
            console.log(newTrain.time);
            console.log(newTrain.frequency);

            alert("Train successfully added");

            //clears all of the text boxes
            $("#train-name-input").val("");
            $("#destination-input").val("");
            $("#first-train-time-input").val("");
            $("#frequency-input").val("");
        };
    });

    // Prevents page from refreshing
    $("form").on("submit", function (event) {
        event.preventDefault();
        console.log("Hello, form submit");

        return false;
    });
});



database.ref().on("child_added", function (childSnapshot) {
    
    var startTimeConverted = moment(childSnapshot.val().time, "hh:mm").subtract(1, "years");
    console.log(startTimeConverted);
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    console.log("time" + timeDiff);
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    console.log("timeremain" + timeRemain);

    var minToArrival = childSnapshot.val().frequency - timeRemain;
    console.log("mintoarrival" + minToArrival);
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;

    var newrow = $("<tr>");
    newrow.append($("<td>" + childSnapshot.val().name + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
    newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
    newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
    newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
    $("#train-table > tbody").append(newrow);
   
});

$(document).on("click", ".arrival", function () {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
});