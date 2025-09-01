import { notesSharp, notesFlat, instrumentTuningPresets, musicTheory, fretmarkPositions } from './music-theory.js';

(function() {
    const root = document.documentElement;

    const selectedInstrumentSelector = document.querySelector('#instrument-selector');
    const accidentalSelector = document.querySelector('.accidental-selector');
    const numberOfFretsSelector = document.querySelector('#number-of-frets');
    const noteDisplayModeSelector = document.querySelector('#note-display-mode');
    const displayModeSelector = document.querySelector('.display-mode-selector');
    const scaleKeySelector = document.querySelector('#scale-key');
    const scaleModeSelector = document.querySelector('#scale-mode');
    const triadKeySelector = document.querySelector('#triad-key');
    const triadTypeSelector = document.querySelector('#triad-type');
    const intervalKeySelector = document.querySelector('#interval-key');
    const intervalTypeSelector = document.querySelector('#interval-type');

    const fretboard = document.querySelector('.fretboard');
    const noteNameSection = document.querySelector('.note-name-section');

    const state = {
        allNotes: null,
        noteDisplayMode: 'single', // 'single', 'multiple', 'all'
        accidentals: 'sharps',
        selectedInstrument: 'Guitar',
        numberOfFrets: 21,
        displayMode: 'free', // 'free', 'scales', 'triads', 'intervals'
        sharedRoot: null,
        scale: { type: null },
        triad: { type: null },
        interval: { type: null },
        hoverDisabled: false,
        get numberOfStrings() { return instrumentTuningPresets[this.selectedInstrument].length; },
        get scaleEnabled() { return this.displayMode === 'scales'; },
        get triadEnabled() { return this.displayMode === 'triads'; },
        get intervalEnabled() { return this.displayMode === 'intervals'; },
        get showAllNotes() { return this.noteDisplayMode === 'all'; },
        get showMultipleNotes() { return this.noteDisplayMode === 'multiple'; }
    };

    const app = {
        init() {
            this.setupFretboard();
            this.setupSelectedInstrumentSelector();
            this.setupScaleSelectors();
            this.setupTriadSelectors();
            this.setupIntervalSelectors();
            this.setupNoteNameSection();
            handlers.setupEventListeners();
        },

        setupSelectedInstrumentSelector(instrument) {
            for (instrument in instrumentTuningPresets) {
                let instrumentOption = tools.createElement('option', instrument);
                selectedInstrumentSelector.appendChild(instrumentOption);
            }
        },

        setupScaleSelectors() {
            // Populate scale key selector
            let defaultKeyOption = tools.createElement('option', 'Select root');
            defaultKeyOption.value = '';
            scaleKeySelector.appendChild(defaultKeyOption);

            let noteNames = state.accidentals === 'sharps' ? notesSharp : notesFlat;
            noteNames.forEach((noteName, index) => {
                let keyOption = tools.createElement('option', noteName);
                keyOption.value = index;
                scaleKeySelector.appendChild(keyOption);
            });

            // Populate scale mode selector
            let defaultModeOption = tools.createElement('option', 'Select scale');
            defaultModeOption.value = '';
            scaleModeSelector.appendChild(defaultModeOption);

            musicTheory.scales.types.forEach((scaleType) => {
                let modeOption = tools.createElement('option', scaleType.name);
                modeOption.value = scaleType.value;
                scaleModeSelector.appendChild(modeOption);
            });

            // Initially hide selectors and labels
            scaleKeySelector.style.display = 'none';
            scaleModeSelector.style.display = 'none';
            const scaleKeyLabel = document.querySelector('label[for="scale-key"]');
            const scaleModeLabel = document.querySelector('label[for="scale-mode"]');
            scaleKeyLabel.style.display = 'none';
            scaleModeLabel.style.display = 'none';
        },

        setupTriadSelectors() {
            // Populate triad key selector
            let defaultKeyOption = tools.createElement('option', 'Select root');
            defaultKeyOption.value = '';
            triadKeySelector.appendChild(defaultKeyOption);

            let noteNames = state.accidentals === 'sharps' ? notesSharp : notesFlat;
            noteNames.forEach((noteName, index) => {
                let keyOption = tools.createElement('option', noteName);
                keyOption.value = index;
                triadKeySelector.appendChild(keyOption);
            });

            // Populate triad type selector
            let defaultTypeOption = tools.createElement('option', 'Select type');
            defaultTypeOption.value = '';
            triadTypeSelector.appendChild(defaultTypeOption);

            musicTheory.triads.types.forEach((triadType) => {
                let typeOption = tools.createElement('option', triadType.name);
                typeOption.value = triadType.value;
                triadTypeSelector.appendChild(typeOption);
            });

            // Initially hide selectors and labels
            triadKeySelector.style.display = 'none';
            triadTypeSelector.style.display = 'none';
            const triadKeyLabel = document.querySelector('label[for="triad-key"]');
            const triadTypeLabel = document.querySelector('label[for="triad-type"]');
            triadKeyLabel.style.display = 'none';
            triadTypeLabel.style.display = 'none';
        },

        setupIntervalSelectors() {
            // Populate interval key selector
            let defaultKeyOption = tools.createElement('option', 'Select root');
            defaultKeyOption.value = '';
            intervalKeySelector.appendChild(defaultKeyOption);

            let noteNames = state.accidentals === 'sharps' ? notesSharp : notesFlat;
            noteNames.forEach((noteName, index) => {
                let keyOption = tools.createElement('option', noteName);
                keyOption.value = index;
                intervalKeySelector.appendChild(keyOption);
            });

            // Populate interval type selector
            let defaultTypeOption = tools.createElement('option', 'Select interval');
            defaultTypeOption.value = '';
            intervalTypeSelector.appendChild(defaultTypeOption);

            musicTheory.intervals.types.forEach((intervalType) => {
                let typeOption = tools.createElement('option', intervalType.name);
                typeOption.value = intervalType.value;
                intervalTypeSelector.appendChild(typeOption);
            });

            // Initially hide selectors and labels
            intervalKeySelector.style.display = 'none';
            intervalTypeSelector.style.display = 'none';
            const intervalKeyLabel = document.querySelector('label[for="interval-key"]');
            const intervalTypeLabel = document.querySelector('label[for="interval-type"]');
            intervalKeyLabel.style.display = 'none';
            intervalTypeLabel.style.display = 'none';
        },

        setupFretboard() {
            // Empty div before setting up
            fretboard.innerHTML = '';

            root.style.setProperty('--number-of-strings', state.numberOfStrings)
            root.style.setProperty('--number-of-frets', state.numberOfFrets)

            // Create strings
            for (let i = 0; i < state.numberOfStrings; i++) {
                let string = tools.createElement('div');
                string.classList.add('string');
                fretboard.appendChild(string);

                // Create frets
                for (let j = 0; j <= state.numberOfFrets; j++) {
                    let fret = tools.createElement('div');
                    fret.classList.add('note-fret');
                    string.appendChild(fret);

                    // Assign the right note
                    let noteName = this.generateNoteNames((j + instrumentTuningPresets[state.selectedInstrument][i]))
                    fret.setAttribute('data-note', noteName);

                    // Create fretmarks
                    if (i === 0 && fretmarkPositions.single.indexOf(j) !== -1) {
                        fret.classList.add('single-fretmark')
                    } else if (i === 0 && fretmarkPositions.double.indexOf(j) !== -1) {
                        let doubleFretmark = tools.createElement('div')
                        doubleFretmark.classList.add('double-fretmark')
                        fret.appendChild(doubleFretmark);
                    }
                }
            }
            
            // Reapply highlighting after fretboard setup
            this.highlightNotes();
        },

        generateNoteNames(noteIndex) {
            noteIndex = noteIndex % 12;
            let noteName;
            noteName = state.accidentals === 'flats' ? notesFlat[noteIndex] : notesSharp[noteIndex];

            return noteName;
        },

        setupNoteNameSection() {
            noteNameSection.innerHTML = '';

            let noteNames;

            // If scale mode is enabled and both key and type are selected, show scale notes
            if (state.scaleEnabled && state.sharedRoot !== null && state.scale.type !== null) {
                noteNames = tools.calculateNotes(state.sharedRoot, state.scale.type, musicTheory.scales.intervals);
            }
            // If triad mode is enabled and both key and type are selected, show triad notes
            else if (state.triadEnabled && state.sharedRoot !== null && state.triad.type !== null) {
                noteNames = tools.calculateNotes(state.sharedRoot, state.triad.type, musicTheory.triads.intervals);
            }
            // If interval mode is enabled and both key and type are selected, show interval notes
            else if (state.intervalEnabled && state.sharedRoot !== null && state.interval.type !== null) {
                noteNames = tools.calculateNotes(state.sharedRoot, state.interval.type, musicTheory.intervals.intervals);
            }
            // Default chromatic scale
            else {
                noteNames = state.accidentals === 'sharps' ? notesSharp : notesFlat;
            }

            noteNames.forEach((noteName) => {
                let noteNameElement = tools.createElement('span', noteName);
                noteNameSection.appendChild(noteNameElement);
            })
        },

        toggleMultipleNotes(noteName, opacity) {
            tools.forEachNote(note => {
                if (note.dataset.note === noteName) {
                    note.style.setProperty('--note-dot-opacity', opacity);
                }
            });
        },

        highlightNotes() {
            if (state.scaleEnabled && state.sharedRoot !== null && state.scale.type !== null) {
                const scaleNotes = tools.calculateNotes(state.sharedRoot, state.scale.type, musicTheory.scales.intervals);
                const colors = { root: '#FF5722', other: '#2196F3' };
                tools.highlightNotes(scaleNotes, colors);
            } else if (state.triadEnabled && state.sharedRoot !== null && state.triad.type !== null) {
                const triadNotes = tools.calculateNotes(state.sharedRoot, state.triad.type, musicTheory.triads.intervals);
                const colors = { root: '#9C27B0', other: '#E91E63' };
                tools.highlightNotes(triadNotes, colors);
            } else if (state.intervalEnabled && state.sharedRoot !== null && state.interval.type !== null) {
                const intervalNotes = tools.calculateNotes(state.sharedRoot, state.interval.type, musicTheory.intervals.intervals);
                const colors = { root: '#4CAF50', other: '#8BC34A' };
                tools.highlightNotes(intervalNotes, colors);
            } else {
                tools.clearHighlights();
            }
        }
    };

    const handlers = {
        showNoteDot(event) {
            if (state.hoverDisabled) return;

            if (event.target.classList.contains('note-fret')) {
                if (state.showMultipleNotes) {
                    app.toggleMultipleNotes(event.target.dataset.note, 1);
                } else {
                    event.target.style.setProperty('--note-dot-opacity', 1);
                }
            }
        },

        hideNoteDot(event) {
            if (state.hoverDisabled) return;

            if (event.target.classList.contains('note-fret')) {
                if (state.showMultipleNotes) {
                    app.toggleMultipleNotes(event.target.dataset.note, 0);
                } else {
                    event.target.style.setProperty('--note-dot-opacity', 0);
                }
            }
        },

        setSelectedInstrument(event) {
            state.selectedInstrument = event.target.value;
            app.setupFretboard();
        },

        setAccidentals(event) {
            if (event.target.classList.contains('acc-select')) {
                state.accidentals = event.target.value;
                app.setupFretboard();
                app.setupNoteNameSection();
            }
        },

        setNumberOfFrets() {
            state.numberOfFrets = numberOfFretsSelector.value;
            app.setupFretboard();
        },

        setNoteDisplayMode(event) {
            state.noteDisplayMode = event.target.value;
            root.style.setProperty('--note-dot-opacity', state.showAllNotes ? 1 : 0);
            tools.updateHoverDisabled();
            app.setupFretboard();
        },

        setNotesToShow(event) {
            if (state.hoverDisabled) return;
            app.toggleMultipleNotes(event.target.innerText, 1);
        },

        setNotesToHide(event) {
            if (state.hoverDisabled) return;
            app.toggleMultipleNotes(event.target.innerText, 0);
        },

        setDisplayMode(event) {
            state.displayMode = event.target.value;
            
            // Show/hide scale controls
            const showScales = state.displayMode === 'scales';
            tools.toggleElementVisibility('label[for="scale-key"]', showScales);
            tools.toggleElementVisibility('label[for="scale-mode"]', showScales);
            tools.toggleElementVisibility('#scale-key', showScales);
            tools.toggleElementVisibility('#scale-mode', showScales);
            
            // Show/hide triad controls
            const showTriads = state.displayMode === 'triads';
            tools.toggleElementVisibility('label[for="triad-key"]', showTriads);
            tools.toggleElementVisibility('label[for="triad-type"]', showTriads);
            tools.toggleElementVisibility('#triad-key', showTriads);
            tools.toggleElementVisibility('#triad-type', showTriads);
            
            // Show/hide interval controls
            const showIntervals = state.displayMode === 'intervals';
            tools.toggleElementVisibility('label[for="interval-key"]', showIntervals);
            tools.toggleElementVisibility('label[for="interval-type"]', showIntervals);
            tools.toggleElementVisibility('#interval-key', showIntervals);
            tools.toggleElementVisibility('#interval-type', showIntervals);
            
            // Sync shared root to current selector when switching modes
            if (showScales) {
                scaleKeySelector.value = state.sharedRoot || '';
            } else if (showTriads) {
                triadKeySelector.value = state.sharedRoot || '';
            } else if (showIntervals) {
                intervalKeySelector.value = state.sharedRoot || '';
            }
            
            // Clear type selections when switching modes
            if (!showScales) {
                state.scale.type = null;
                scaleModeSelector.value = '';
            }
            if (!showTriads) {
                state.triad.type = null;
                triadTypeSelector.value = '';
            }
            if (!showIntervals) {
                state.interval.type = null;
                intervalTypeSelector.value = '';
            }
            
            tools.updateHoverDisabled();
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setScaleKey(event) {
            state.sharedRoot = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setScaleMode(event) {
            state.scale.type = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setTriadKey(event) {
            state.sharedRoot = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setTriadType(event) {
            state.triad.type = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setIntervalKey(event) {
            state.sharedRoot = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setIntervalType(event) {
            state.interval.type = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setupEventListeners() {
            fretboard.addEventListener('mouseover', this.showNoteDot);
            fretboard.addEventListener('mouseout', this.hideNoteDot);

            selectedInstrumentSelector.addEventListener('change', this.setSelectedInstrument);
            accidentalSelector.addEventListener('click', this.setAccidentals);
            numberOfFretsSelector.addEventListener('change', this.setNumberOfFrets);
            noteDisplayModeSelector.addEventListener('change', this.setNoteDisplayMode);
            displayModeSelector.addEventListener('change', this.setDisplayMode);
            scaleKeySelector.addEventListener('change', this.setScaleKey);
            scaleModeSelector.addEventListener('change', this.setScaleMode);
            triadKeySelector.addEventListener('change', this.setTriadKey);
            triadTypeSelector.addEventListener('change', this.setTriadType);
            intervalKeySelector.addEventListener('change', this.setIntervalKey);
            intervalTypeSelector.addEventListener('change', this.setIntervalType);

            noteNameSection.addEventListener('mouseover', this.setNotesToShow);
            noteNameSection.addEventListener('mouseout', this.setNotesToHide);
        }
    };

    const tools = {
        createElement(element, content) {
            element = document.createElement(element);

            if (arguments.length > 1) {
                element.innerHTML = content;
            }
            return element;
        },

        forEachNote(callback) {
            state.allNotes = document.querySelectorAll('.note-fret');
            for (let i = 0; i < state.allNotes.length; i++) {
                callback(state.allNotes[i], i);
            }
        },

        calculateNotes(key, type, intervalsSource) {
            if (key === null || type === null) return [];

            const intervals = intervalsSource[type];
            const noteNames = state.accidentals === 'sharps' ? notesSharp : notesFlat;

            return intervals.map(interval => {
                const noteIndex = (parseInt(key) + interval) % 12;
                return noteNames[noteIndex];
            });
        },

        toggleElementVisibility(selector, visible) {
            const element = document.querySelector(selector);
            if (element) element.style.display = visible ? 'inline-block' : 'none';
        },

        clearHighlights() {
            this.forEachNote(note => {
                note.style.removeProperty('--note-dot-opacity');
                note.style.removeProperty('--note-dot-color');
            });
        },

        highlightNotes(notes, colors) {
            this.forEachNote(note => {
                if (notes.includes(note.dataset.note)) {
                    note.style.setProperty('--note-dot-opacity', 1);
                    const colorKey = note.dataset.note === notes[0] ? 'root' : 'other';
                    note.style.setProperty('--note-dot-color', colors[colorKey]);
                } else {
                    note.style.removeProperty('--note-dot-opacity');
                    note.style.removeProperty('--note-dot-color');
                }
            });
        },

        updateHoverDisabled() {
            state.hoverDisabled = state.showAllNotes || state.scaleEnabled || state.triadEnabled || state.intervalEnabled;
        }
    };

    app.init();
})();