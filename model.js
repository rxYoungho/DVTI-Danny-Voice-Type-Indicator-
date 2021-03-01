
    const URL = "https://teachablemachine.withgoogle.com/models/KySCvWSLB/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }
    var best_acc = 0;
    var best_label = "";
    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");
        for (let i = 0; i < classLabels.length; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            for (let i = 1; i < classLabels.length; i++) {

                const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
                if (result.scores[i] > 0.8) {
                    best_label = classLabels[i];
                    console.log(best_label, result.scores[i]);
                }
            }
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });
       
        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }
    // 다른 페이지로 보내기
    async function submit() {
        best_label="영호";
        sessionStorage.setItem("best_label", best_label);
        
        const labelContainer2 = document.getElementById("result-label");

        labelContainer2.appendChild(document.createElement("div"));

        labelContainer2.innerHTML = best_label;

        return (best_label);
    }

    var button = $('.button');
    var mic = button.find('svg');
    var active = $('.active-wrapper');
    var stop = $('.stop-button');
    var dotCol = $('.dots-col');
    var w = $(window);
    var vw = w.innerWidth();
    var vh = w.innerHeight();
    var bw = button.innerWidth();
    var bh = button.innerHeight();
    var s;

    var clone = button.clone();
    clone.find('svg').remove();
    button.before(clone);

    var open = function () {

        if (vw > vh) {
            s = vw / bw * 1.5;
        } else {
            s = vh / bh * 1.5;
        }
        var scale = 'scale(' + s + ') translate(-50%,-50%)';

        clone.css({
            transform: scale
        });

        mic.css({
            fill: 'rgba(0,0,0,0.2)',
            transform: 'scale(4)'
        });

        button.on('transitionend', function () {
            active.addClass('active');
            $(this).off('transitionend');
        });

        return false;
    };

    var close = function () {
        active.removeClass('active');
        clone.removeAttr('style');
        mic.removeAttr('style');
        window.location.href = "/Users/user/Desktop/Github/logis-app/loading.html";

    };


    button.on('click', open);
    button.on('click', init);
    stop.on('click', close);
    stop.on('click', submit);
    // stop.on('click', submit);

    



