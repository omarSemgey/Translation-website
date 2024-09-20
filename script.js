const fromText = document.querySelector('.from-text'),
toText = document.querySelector('.to-text'),
exchangeIcon = document.querySelector('.exchange'),
selectTag = document.querySelectorAll('select'),
translateBtn = document.querySelector('button'),
copyIcon = document.querySelectorAll('.row .fa-copy'),
speakIcon = document.querySelectorAll('.row .fa-volume-up');

selectTag.forEach((tag, id) => {
    for(const country_code in countries){
        let selected;
        if(id == 0 && country_code == 'en-GB'){
            selected = 'selected';
        }else if(id == 1 && country_code == 'ar-SA'){
            selected = 'selected';
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML('beforeend', option)
    }
})

translateBtn.addEventListener('click', translate)

exchangeIcon.addEventListener('click',() => {

    let tempText = fromText.value,
    tempLang = selectTag[0].value;

    fromText.value = toText.value;
    toText.value = tempText;

    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;

});
copyIcon.forEach(icon => {
    icon.addEventListener('click', ({target}) => {
        console.log(target.id)
        if(target.id == 'from'){
            if(fromText.value.trim() !== ''){
                navigator.clipboard.writeText(fromText.value)
            }
        }else{
            if(toText.value.trim() !== ''){
                navigator.clipboard.writeText(toText.value)
            }
        }
    })
})

speakIcon.forEach(icon => {
    icon.addEventListener('click', ({target}) => {
        let utterance;
        if(target.id == "from") {
            utterance = new SpeechSynthesisUtterance(fromText.value);
            // utterance.lang = selectTag[0].value;
        } else {
            utterance = new SpeechSynthesisUtterance(toText.value);
            // utterance.lang = selectTag[1].value;
        }
        speechSynthesis.speak(utterance);
    })
})


document.addEventListener('keyup', e => {
    if(e.key === 'Enter' && !e.shiftKey){
        translate()
    }
});

async function translate(){
    if(fromText.value.trim() !== ''){
        let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
        translateBtn.disabled = true;
        toText.value = 'Translating...';
        translateBtn.innerText = 'Translating...'

        let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}&de=omar.semgey@gmail.com`;
        await fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            translateBtn.innerText = 'Translate Text';
            translateBtn.disabled = false;
        })
    }
}