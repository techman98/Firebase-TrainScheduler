 $(document).ready(function () {
     // Initialize Firebase
     var config = {
         apiKey: "AIzaSyBlr7dUxKed1myS89QXvxCr6OK0pTblRoM",
         authDomain: "awesometrainschedule.firebaseapp.com",
         databaseURL: "https://awesometrainschedule.firebaseio.com",
         projectId: "awesometrainschedule",
         storageBucket: "awesometrainschedule.appspot.com",
         messagingSenderId: "38205422673"
     };
     firebase.initializeApp(config);


     var database = firebase.database();

     var train = "";
     var destination = "";
     var maidenVoyage = 0;
     var frequency = 0;
     var timeOfDay = "";
     $("#submit").on("click", function () {
         event.preventDefault();

         train = $("#train-input").val().trim();
         destination = $("#destination-input").val().trim();
         maidenVoyage = $("#maidenDeparture-input").val().trim();
         frequency = parseInt($("#frequency-input").val().trim());

         database.ref().push({
             trainFB: train,
             destinationFB: destination,
             maidenDepartureFB: maidenVoyage,
             frequencyFB: frequency
         });

         $("#train-input").val("");
         $("#destination-input").val("");
         $("#maidenDeparture-input").val("");
         $("#frequency-input").val("");
     });




     database.ref().on("child_added", function (childSnapshot) {

         var firstTimeConverted = moment(maidenVoyage, "HH:mm");
         var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
         var tRemainder = diffTime % childSnapshot.val().frequencyFB;
         var tMinutesTillTrain = childSnapshot.val().frequencyFB - tRemainder;
         var nextTrain = moment().add(tMinutesTillTrain, "minutes");

         if(moment(nextTrain) < 1200) {
           timeOfDay = "am"
        }
        else {
            timeOfDay = "pm"
        }

         $("#allTrains").append("<div class='well'><span class='train-name'> " +
             childSnapshot.val().trainFB +
             " </span><span class='train-destination'> Destination: " + childSnapshot.val().destinationFB +
             " </span><span class='train-frequency'> Train leaves every " + childSnapshot.val().frequencyFB + " minutes" +
             " </span><span class='train-arrival'> Arrival Time: " + moment(nextTrain).format("hh:mm") + timeOfDay +
             " </span><span class='minutes-away'> Minutes Till Train: " + tMinutesTillTrain +
             " </span></div>");

     }, function (errorObject) {
         console.log("The read failed: " + errorObject.code);
     })
 });