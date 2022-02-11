const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");
let liveState = document.getElementById("title");
let someStateX = [];
let coordonX = document.getElementById("coordonx");
let coordonY = document.getElementById("coordony");
let cY = 0
let cX = 0

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
    fontSize: 30,
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



function runDetection() {
    model.detect(video).then(predictions => {
        //initial output, no access
        //console.log("Predictions: ", predictions);
        //created new variable with JSON parsing
         someStateX = JSON.parse(JSON.stringify(predictions));
        if (someStateX.length== 0) {
            liveState.innerText = "no detection"
        } else {
            liveState.innerText = someStateX[0].label
            coordonX.innerText = someStateX[0].bbox[0]
            coordonY.innerText = someStateX[0].bbox[1]
            if(someStateX[0].label !=="face"){
                cX =  someStateX[0].bbox[0]
                cY =  someStateX[0].bbox[1]
            };
           
        }
        // liveState.innerText = predictions;
        model.renderPredictions(predictions, canvas,  context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });

}



// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});


function setup(){
    createCanvas(800,800);
    //capture = createCapture(VIDEO);
    //capture.size(330,240);
}
//console.log(someStateX[0].bbox[0])
function draw(){
   fill(255)
    ellipse(cX, cY,20,20);
    
    
}

