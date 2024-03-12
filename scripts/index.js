let steerWheelAngle = 0;
const angleStepCount = 15;

function brakeActions(action) {
    let $brakePedal = $(".pedal .brake");
    if(action === "apply")
        $brakePedal.css({transform: "scale(0.8)"});
    else if(action=="release")
        $brakePedal.css({transform: "scale(1)"});
}

function steerWheel(direction, isReleased) {
    let angle = angleStepCount;
    if(direction === "left") angle*= -1;
    if(isReleased){
        steerWheelAngle = 0;
        $(".steer-wheel").css({ "transform": `rotate(${steerWheelAngle}deg)`, "transition-delay": "500ms", "transition-property": "transform"})
    } else {
        // while(true){--------- find logic to repeat
            steerWheelAngle = (steerWheelAngle+angle)%360;
            $(".steer-wheel").css({transform: `rotate(${steerWheelAngle}deg)`});
        // }
    }
    console.log(direction);
    console.log(steerWheelAngle+"   "+$(".steer-wheel").css("transform"));
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

(function(){
    $(document).on("keydown", function (event) {
        if(event.key == "ArrowRight") steerWheel("right", false);
        else if(event.key == "ArrowLeft") steerWheel("left", false);
        else if(event.key == "b" || event.key == "B") brakeActions("apply");
        else if(event.key == "c" || event.key == "C") showRearViewCamera();
    });

    $(document).on("keyup", function (event) {
        if(event.key == "ArrowRight") steerWheel("left", true);
        else if(event.key == "ArrowLeft") steerWheel("right", true);
        else if(event.key == "b" || event.key == "B") brakeActions("release");
    });
}());