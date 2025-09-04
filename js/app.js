import { notesSharp, notesFlat, instrumentTuningPresets, musicTheory, fretmarkPositions } from './music-theory.js';

(function() {
    const root = document.documentElement;

    const selectedInstrumentSelector = document.querySelector('#instrument-selector');
    const accidentalSelector = document.querySelector('.accidental-selector');
    const numberOfFretsSelector = document.querySelector('#number-of-frets');
    const noteDisplayModeSelector = document.querySelector('#note-display-mode');
    const scaleKeySelector = document.querySelector('#scale-key');
    const scaleModeSelector = document.querySelector('#scale-mode');
    const triadKeySelector = document.querySelector('#triad-key');
    const triadTypeSelector = document.querySelector('#triad-type');
    const intervalKeySelector = document.querySelector('#interval-key');
    const intervalTypeSelector = document.querySelector('#interval-type');

    const fretboard = document.querySelector('.fretboard');
    const noteNameSection = document.querySelector('.note-name-section');
    const displayModeRadios = document.querySelectorAll('input[name="display-mode"]');

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

        setupModeSelectors(mode, keySelector, typeSelector, typeDefaultText, musicTheoryTypes) {
            // Populate key selector
            const defaultKeyOption = tools.createElement('option', 'Select root');
            defaultKeyOption.value = '';
            keySelector.appendChild(defaultKeyOption);

            const noteNames = state.accidentals === 'sharps' ? notesSharp : notesFlat;
            noteNames.forEach((noteName, index) => {
                const keyOption = tools.createElement('option', noteName);
                keyOption.value = index;
                keySelector.appendChild(keyOption);
            });

            // Populate type selector
            const defaultTypeOption = tools.createElement('option', typeDefaultText);
            defaultTypeOption.value = '';
            typeSelector.appendChild(defaultTypeOption);

            musicTheoryTypes.forEach((type) => {
                const typeOption = tools.createElement('option', type.name);
                typeOption.value = type.value;
                typeSelector.appendChild(typeOption);
            });

            // Initially hide selectors and labels
            keySelector.style.display = 'none';
            typeSelector.style.display = 'none';
            const keyLabel = document.querySelector(`label[for="${keySelector.id}"]`);
            const typeLabel = document.querySelector(`label[for="${typeSelector.id}"]`);
            keyLabel.style.display = 'none';
            typeLabel.style.display = 'none';
        },

        setupScaleSelectors() {
            this.setupModeSelectors('scales', scaleKeySelector, scaleModeSelector, 'Select scale', musicTheory.scales.types);
        },

        setupTriadSelectors() {
            this.setupModeSelectors('triads', triadKeySelector, triadTypeSelector, 'Select type', musicTheory.triads.types);
        },

        setupIntervalSelectors() {
            this.setupModeSelectors('intervals', intervalKeySelector, intervalTypeSelector, 'Select interval', musicTheory.intervals.types);
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
            return state.accidentals === 'flats' ? notesFlat[noteIndex] : notesSharp[noteIndex];
        },

        setupNoteNameSection() {
            noteNameSection.innerHTML = '';

            const noteNames = tools.getCurrentNoteNames();
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
            const activeMode = tools.getActiveMode();
            if (activeMode) {
                const notes = tools.calculateNotes(state.sharedRoot, activeMode.stateProperty.type, activeMode.intervals);
                tools.highlightNotes(notes, activeMode.colors);
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
            
            const modeConfig = {
                scales: { 
                    keySelector: scaleKeySelector, 
                    typeSelector: scaleModeSelector, 
                    stateProperty: state.scale,
                    selectors: ['label[for="scale-key"]', 'label[for="scale-mode"]', '#scale-key', '#scale-mode']
                },
                triads: { 
                    keySelector: triadKeySelector, 
                    typeSelector: triadTypeSelector, 
                    stateProperty: state.triad,
                    selectors: ['label[for="triad-key"]', 'label[for="triad-type"]', '#triad-key', '#triad-type']
                },
                intervals: { 
                    keySelector: intervalKeySelector, 
                    typeSelector: intervalTypeSelector, 
                    stateProperty: state.interval,
                    selectors: ['label[for="interval-key"]', 'label[for="interval-type"]', '#interval-key', '#interval-type']
                }
            };
            
            // Show/hide controls for each mode
            Object.keys(modeConfig).forEach(mode => {
                const config = modeConfig[mode];
                const isActiveMode = state.displayMode === mode;
                
                // Toggle visibility
                config.selectors.forEach(selector => {
                    tools.toggleElementVisibility(selector, isActiveMode);
                });
                
                // Sync shared root or clear state
                if (isActiveMode) {
                    config.keySelector.value = state.sharedRoot || '';
                } else {
                    config.stateProperty.type = null;
                    config.typeSelector.value = '';
                }
            });
            
            tools.updateHoverDisabled();
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setRootKey(event) {
            state.sharedRoot = event.target.value === '' ? null : event.target.value;
            
            // Sync the shared root to all selectors
            const rootValue = state.sharedRoot || '';
            [scaleKeySelector, triadKeySelector, intervalKeySelector].forEach(selector => {
                if (selector.value !== rootValue) {
                    selector.value = rootValue;
                }
            });
            
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setScaleKey(event) { handlers.setRootKey(event); },
        setTriadKey(event) { handlers.setRootKey(event); },
        setIntervalKey(event) { handlers.setRootKey(event); },

        setModeType(event, modeProperty) {
            modeProperty.type = event.target.value === '' ? null : event.target.value;
            app.highlightNotes();
            app.setupNoteNameSection();
        },

        setScaleMode(event) { handlers.setModeType(event, state.scale); },
        setTriadType(event) { handlers.setModeType(event, state.triad); },
        setIntervalType(event) { handlers.setModeType(event, state.interval); },

        setupEventListeners() {
            fretboard.addEventListener('mouseover', this.showNoteDot);
            fretboard.addEventListener('mouseout', this.hideNoteDot);

            selectedInstrumentSelector.addEventListener('change', this.setSelectedInstrument);
            accidentalSelector.addEventListener('click', this.setAccidentals);
            numberOfFretsSelector.addEventListener('change', this.setNumberOfFrets);
            noteDisplayModeSelector.addEventListener('change', this.setNoteDisplayMode);
            displayModeRadios.forEach(radio => {
                radio.addEventListener('change', this.setDisplayMode);
            });
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
            if (element) element.style.display = visible ? '' : 'none';
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
        },

        getModeConfig() {
            return {
                scales: { 
                    stateProperty: state.scale, 
                    intervals: musicTheory.scales.intervals,
                    colors: { root: '#ff0404', other: '#2196F3' },
                    enabled: state.scaleEnabled
                },
                triads: { 
                    stateProperty: state.triad, 
                    intervals: musicTheory.triads.intervals,
                    colors: { root: '#ff0404', other: '#2196F3' },
                    enabled: state.triadEnabled
                },
                intervals: { 
                    stateProperty: state.interval, 
                    intervals: musicTheory.intervals.intervals,
                    colors: { root: '#ff0404', other: '#2196F3' },
                    enabled: state.intervalEnabled
                }
            };
        },

        getActiveMode() {
            const config = this.getModeConfig();
            const activeMode = Object.values(config).find(mode => 
                mode.enabled && state.sharedRoot !== null && mode.stateProperty.type !== null
            );
            return activeMode || null;
        },

        getCurrentNoteNames() {
            const activeMode = this.getActiveMode();
            if (activeMode) {
                return this.calculateNotes(state.sharedRoot, activeMode.stateProperty.type, activeMode.intervals);
            }
            return state.accidentals === 'sharps' ? notesSharp : notesFlat;
        }
    };

    app.init();
})();