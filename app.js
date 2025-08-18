const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector('.accidental-selector');
const numberOfFretsSelector = document.querySelector('#number-of-frets');
const showAllNotesSelector = document.querySelector('#show-all-notes');

const singleFretmarkPositions = [3, 5, 7, 9, 15, 17, 19, 21, 21, 27, 29]
const doubleFretmarkPositions = [12, 24]

const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
let accidentals = 'sharps';

const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass': [7, 2, 9, 4],
    'Bass (5 string)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
};
let selectedInstrument = 'Guitar'
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
let numberOfFrets = 21;

const app = {
    init() {
        this.setupFretboard();
        this.setupSelectedInstrumentSelector()
        this.setupEventListeners();
    },
    setupFretboard() {
        // Empty div before setting up
        fretboard.innerHTML = '';

        root.style.setProperty('--number-of-strings', numberOfStrings)
        root.style.setProperty('--number-of-frets', numberOfFrets)

        // Create strings
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);

            // Create frets
            for (let j = 0; j <= numberOfFrets; j++) {
                let fret = tools.createElement('div');
                fret.classList.add('note-fret');
                string.appendChild(fret);

                // Assign the right note
                let noteName = this.generateNoteNames((j + instrumentTuningPresets[selectedInstrument][i]))
                fret.setAttribute('data-note', noteName);

                // Create fretmarks
                if (i === 0 && singleFretmarkPositions.indexOf(j) !== -1) {
                    fret.classList.add('single-fretmark')
                } else if (i === 0 && doubleFretmarkPositions.indexOf(j) !== -1) {
                    let doubleFretmark = tools.createElement('div')
                    doubleFretmark.classList.add('double-fretmark')
                    fret.appendChild(doubleFretmark);
                }
            }
        }
    },

    generateNoteNames(noteIndex) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats') {
            noteName = notesFlat[noteIndex];
        } else if (accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }

        return noteName;
    },

    setupSelectedInstrumentSelector(instrument) {
        for (instrument in instrumentTuningPresets) {
            let instrumentOption = tools.createElement('option', instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        }
    },

    showNodeDot(event) {
        if (event.target.classList.contains('note-fret')) {
            event.target.style.setProperty('--note-dot-opacity', 1);
        }
    },
    hideNodeDot(event) {
        if (event.target.classList.contains('note-fret')) {
            event.target.style.setProperty('--note-dot-opacity', 0);
        }
    },

    setupEventListeners() {
        fretboard.addEventListener('mouseover', this.showNodeDot);
        fretboard.addEventListener('mouseout', this.hideNodeDot);

        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });
        accidentalSelector.addEventListener('click', (event) => {
            if (event.target.classList.contains('acc-select')) {
                accidentals = event.target.value;
                this.setupFretboard()
            }
        });
        numberOfFretsSelector.addEventListener('change', (event) => {
            numberOfFrets = event.target.value;
            this.setupFretboard();
        });
        showAllNotesSelector.addEventListener('change', () => {
            if (showAllNotesSelector.checked) {
                root.style.setProperty('--note-dot-opacity', 1);
                fretboard.removeEventListener('mouseover', this.showNodeDot);
                fretboard.removeEventListener('mouseout', this.hideNodeDot);
            } else {
                root.style.setProperty('--note-dot-opacity', 0);
                fretboard.addEventListener('mouseover', this.showNodeDot);
                fretboard.addEventListener('mouseout', this.hideNodeDot);
            }
            this.setupFretboard();
        });
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);

        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();