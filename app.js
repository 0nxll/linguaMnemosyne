const DICTIONARY_API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const DEFINITIONS_DIV = document.getElementById('definitions');

const wordElement = document.querySelector(".word");
const definitionsElement = document.querySelector(".def");
const phoneticsElement = document.querySelector(".phon");
const synonymsElement = document.querySelector(".syn");
const antonymsElement = document.querySelector(".ant");
const originElement = document.querySelector(".orig");
const panelMain = document.querySelector(".panelMain");

const fetchWordDetails = async word => {

    wordElement.innerHTML = '';
    definitionsElement.innerHTML ='';
    phoneticsElement.innerHTML = '';
    synonymsElement.innerHTML = '';
    antonymsElement.innerHTML = '';
    originElement.innerHTML = '';

    document.getElementById('word').value = '';

    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("errorWordMessage").style.display = "none";


    document.getElementById("loadingMessage").style.display = "block";
    console.log(`Making request for details of ${word}...`);
    const response = await fetch(DICTIONARY_API_BASE_URL + word);
    const json = await response.json();
    const details = {
        word: '',
        definitions: [],
        phonetics: [],
        synonyms: [],
        antonyms: [],
        origin: ''
    };

    if (json.length > 0) {
        details.word = json[0].word;
        const entry = json[0];

        if (entry.meanings.length > 0) {
            entry.meanings.slice(0, 3).forEach(meaning => {
                if (meaning.definitions.length > 0) {
                    details.definitions.push(meaning.definitions[0].definition);
                }
            });
        }

        if (entry.phonetics.length > 0) {
            details.phonetics.push(entry.phonetics[0].text);
        }


        if (entry.meanings.length > 0) {
            entry.meanings.forEach(meaning => {
                if (meaning.synonyms && meaning.synonyms.length > 0) {
                    details.synonyms.push(...meaning.synonyms.slice(0, 5));
                }
                if (meaning.antonyms && meaning.antonyms.length > 0) {
                    details.antonyms.push(...meaning.antonyms.slice(0, 3));
                }
            });
        }

        if (entry.origin) {
            details.origin = entry.origin;
        }
    }
    document.getElementById("loadingMessage").style.display = "none";
    return details;
};




const displayWordDetails = details => {

    wordElement.innerText = details.word;

    if (!details) {
        wordElement.innerHTML = "Please wait...";
        return;
    }

    if (!details.word) {
        document.getElementById("errorWordMessage").style.display = "block";
        return;
    }


    if (details.definitions.length > 0) {
        const definitionsList = document.createElement("ul");
        definitionsList.innerHTML = "<h3>Definitions:</h3>";
        details.definitions.forEach(def => {
            const definitionItem = document.createElement("li");
            definitionItem.innerText = def;
            definitionsList.appendChild(definitionItem);
        });
        definitionsElement.appendChild(definitionsList);
    } else {
        definitionsElement.innerHTML = '<h3>Definitions:</h3><p>No definitions found or not available.</p>';
    }
    
    if (details.phonetics.length > 0) {
        phoneticsElement.innerHTML = `<p>${details.phonetics.join(', ')}</p>`;
    } else {
        phoneticsElement.innerHTML = '<p>No phonetics found or not available.</p>';

    }

    if (details.synonyms.length > 0) {
        synonymsElement.innerHTML = `<h3>Synonyms:</h3><p>${details.synonyms.slice(0, 5).join(', ')}</p>`;
    } else {
        synonymsElement.innerHTML = '<h3>Synonyms:</h3><p>No synonyms found or not available.</p>';
    }

    if (details.antonyms.length > 0) {
        antonymsElement.innerHTML = `<h3>Antonyms:</h3><p>${details.antonyms.slice(0, 3).join(', ')}</p>`;
    } else {
        antonymsElement.innerHTML = '<h3>Antonyms:</h3><p>No antonyms found or not available.</p>';
    }

    if (details.origin) {
        originElement.innerHTML = `<h3>Origin:</h3><p>${details.origin}</p>`;
    } else {
        originElement.innerHTML = '<h3>Origin:</h3><p>No origins found or not available.</p>';

    }

};


const getWordDetails = () => {
    const word = document.getElementById('word').value;
    if (word == null || word == '') {
        return alert('Error: You must enter a word to fetch');
    }


    fetchWordDetails(word)
        .then(details => {
            displayWordDetails(details);
        })
        .catch(_ => {
            document.getElementById("loadingMessage").style.display = "none";
            document.getElementById("errorMessage").style.display = "block";
            return;
        });
};


const inputElement = document.getElementById('word');
inputElement.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        getWordDetails();
    }
});
