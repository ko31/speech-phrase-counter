var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

var button = document.querySelector('button');
var phrase = document.querySelector('#phrase');
var sentence = document.querySelector('#sentence');
var result = document.querySelector('#result');

function recognizeSentence(){
    button.disabled = true;
    button.textContent = '音声認識中です…';

    var recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = function(event) {
        sentence.value = event.results[0][0].transcript;
        countPhrase();
    }

    recognition.onspeechend = function() {
        recognition.stop();
        button.disabled = false;
        button.textContent = '文章を音声入力する';
    }

    recognition.onerror = function(event) {
        button.disabled = false;
        button.textContent = '文章を音声入力する';
    }
}

function countPhrase(){

    var delimiter;
    switch (document.querySelector('input[name="delimiter"]:checked').value) {
        case 'csv':
            delimiter = ',';
            break;
        case 'tsv':
            delimiter = "\t";
            break;
        default:
            delimiter = "\t";
    }

    var counts = [];
    phrase.value.split(/\r\n|\n/).forEach(function(phrase) {
        var count = (sentence.value.match(new RegExp(phrase, "g")) || []).length;
        if (!count) {
            return;
        }
        counts.push(phrase + delimiter + count);
    })
    result.value = counts.join("\n");
}

button.addEventListener('click', recognizeSentence);

result.addEventListener('focus', function(){
    this.select();
});
