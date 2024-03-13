import {appConstants, colors, durations} from "../constants/appConstants.js";

var car = {
    isOn : false,
    steerWheelAngle: 0,
    speed : 0,
    fuel : 60,
}

function updateFuel(isConsumed, isRefilled) {
    if(isRefilled) {
        car.fuel = 60;
    } else if (isConsumed) {
    }
}

function showMap(){
    let $mapContainer = $('.google-map');
    function embedMap(position){
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $mapContainer.empty().append('<iframe src = "https://maps.google.com/maps?q=' + latitude + ',' + longitude + '&hl=es;z=14&amp;output=embed"></iframe>');
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(embedMap, showError);
    }
    function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            $mapContainer.empty().append("User denied the request for Geolocation");
            break;
          case error.POSITION_UNAVAILABLE:
            $mapContainer.empty().append("Location information is unavailable.");
            break;
          case error.UNKNOWN_ERROR:
            $mapContainer.empty().append("An unknown error occurred.");
            break;
        }
      }
}

function startCar() {
    if(!car.isOn) {
        car.isOn = true;
        car.fuel = 60;
        $(".engine").css({"background-color": colors.ENGINE_START});
        $("#engineStartAudio")[0].play();
        showMap();
    }
}

function stopCar() {
    if(car.isOn){
        car.isOn = false;
        const $greetingsContainer = $('.greetings-container');
        const $timeContainer = $('.time-container');
        const $temperatureContainer = $('.temperature-container');
        const $mapContainer = $('.google-map');
        $greetingsContainer.empty();
        $timeContainer.empty();
        $temperatureContainer.empty();
        $mapContainer.empty();
        $(".engine").css({"background-color": colors.ENGINE_STOP});
        // TODO: replace with engine off sound
        $("#engineStartAudio")[0].play();
    }
}

function accelerate(isAccelerated) {
    if(isAccelerated) {
        if(car.isOn) $(".dash").addClass("active-ac"); 
        $(".pedal .accelerator").css({"transform": "rotateX(40deg)"});
    } else {
        if(car.isOn) $(".dash").removeClass("active-ac");
        $(".pedal .accelerator").css({"transform": "rotateX(0deg)"});
    }
}

function brakeActions(action) {
    let $brakePedal = $(".pedal .brake");
    if(action === "apply")
        $brakePedal.css({transform: "scale(0.8)"});
    else if(action=="release")
        $brakePedal.css({transform: "scale(1)"});
}

function steerWheel(direction, isReleased) {
    let angle = appConstants.ANGLE_STEP_COUNT;
    if(direction === "left") angle*= -1;
    if(isReleased){
        car.steerWheelAngle = 0;
        $(".steer-wheel").css({ "transform": `rotate(${car.steerWheelAngle}deg)`, "transition-duration": "750ms"});
    } else {
        car.steerWheelAngle = (car.steerWheelAngle+angle)%360;
        $(".steer-wheel").css({transform: `rotate(${car.steerWheelAngle}deg)`, "transition-duration": "0ms"});
    }
}

function showRearViewCamera(){
    const $video = $('#myVidPlayer');
    let $rearViewMirror = $('.rear-view-mirror');
    let $camera = $('.camera');
    let w, h;
    if($video[0].paused)
        onCamera();
    else    
        offCamera();

    function onCamera(){
        window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            $video[0].srcObject = stream;
            $video[0].onloadedmetadata = (e) => {
                $video[0].play();   
                w = $video[0].videoWidth;
                h = $video[0].videoHeight
            };
            $rearViewMirror.removeClass('d-none');
            $camera.addClass('enabled');
        })
        .catch(error => {
            $rearViewMirror.addClass('d-none');
            alert('You have to enable the mike and the camera');
        });
    }

    function offCamera(){
        $rearViewMirror.addClass('d-none');
        $camera.removeClass('enabled');
        const mediaStream = $video[0].srcObject;
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
        $video[0].pause();
    }
}

function getGreetings(hour){
    if(hour >= 6 && hour < 11)
        return "Good Morning..!";
    else if(hour >= 11 && hour < 16)
        return "Good Afternoon..!";
    else if(hour >= 16 && hour < 19)
        return "Good Evening..!";
    else
        return "Good Night..!";
}

function updateTimeGreetings(){
    const $greetingsContainer = $('.greetings-container');
    const $timeContainer = $('.time-container');
    const $temperatureContainer = $('.temperature-container');
    var $date = new Date();
    $timeContainer.empty().append($date.getHours() + ":" + $date.getMinutes());
    $greetingsContainer.empty().append(getGreetings($date.getHours())+ " from Kavya & Nandha");
    $temperatureContainer.empty().append("18° C");
}

(function(){
    let carStartKeyCode = 83;
    $(document).dbKeypress(carStartKeyCode,function(){
        startCar();
    });
        
    // TODO : change all to keycodes
    $(document).on("keydown", function (event) {
        if(event.key == "ArrowRight") steerWheel("right", false);
        else if(event.key == "ArrowLeft") steerWheel("left", false);
        else if(event.key == "b" || event.key == "B") brakeActions("apply");
        else if(event.key == "c" || event.key == "C") showRearViewCamera();
        else if(event.key == "e" || event.key == "E") stopCar();
        else if(event.key == "a" || event.key == "A") accelerate(true);
    });

    $(document).on("keyup", function (event) {
        if(event.key == "ArrowRight") steerWheel("left", true);
        else if(event.key == "ArrowLeft") steerWheel("right", true);
        else if(event.key == "b" || event.key == "B") brakeActions("release");
        else if(event.key == "a" || event.key == "A") accelerate(false);
    });

    //1sec-0.2l
    let fuelConsumptionInterval = setInterval(function(){
        if(car.isOn && car.fuel > 0) {
            car.fuel = (car.fuel-0.2).toFixed(2);
            updateTimeGreetings();
            console.log(car);
        }
    },1000);
}());