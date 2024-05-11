const URL = "https://teachablemachine.withgoogle.com/models/GkT4xojds/";
let model, labelContainer, maxPredictions, webcamCanvas;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcamCanvas = document.getElementById('webcam-canvas');
    labelContainer = document.getElementById('label-container');

    document.getElementById('image-upload').addEventListener('change', (event) => {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.onload = async function() {
                webcamCanvas.getContext('2d').drawImage(img, 0, 0, 224, 224);
                await predict();
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    });
}

// append elements to the DOM
function appendResults(labelProbs) {
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement('div');
        const classPrediction =
            labelProbs[i].className + ": " + labelProbs[i].probability.toFixed(2);
        div.innerText = classPrediction;
        labelContainer.appendChild(div);
    }
}

async function predict() {
    const prediction = await model.predict(webcamCanvas);
    appendResults(prediction);
}

init();
