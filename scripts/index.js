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

(function(){
    $(document).on("keydown", function (event) {
        if(event.key == "ArrowRight") steerWheel("right", false);
        else if(event.key == "ArrowLeft") steerWheel("left", false);
        else if(event.key == "b" || event.key == "B") brakeActions("apply");
    });

    $(document).on("keyup", function (event) {
        if(event.key == "ArrowRight") steerWheel("left", true);
        else if(event.key == "ArrowLeft") steerWheel("right", true);
        else if(event.key == "b" || event.key == "B") brakeActions("release");
    });

}());