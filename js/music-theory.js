export const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass': [7, 2, 9, 4],
    'Bass (5 string)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
};

export const musicTheory = {
    scales: {
        intervals: {
            'ionian': [0, 2, 4, 5, 7, 9, 11],
            'dorian': [0, 2, 3, 5, 7, 9, 10],
            'phrygian': [0, 1, 3, 5, 7, 8, 10],
            'lydian': [0, 2, 4, 6, 7, 9, 11],
            'mixolydian': [0, 2, 4, 5, 7, 9, 10],
            'aeolian': [0, 2, 3, 5, 7, 8, 10],
            'locrian': [0, 1, 3, 5, 6, 8, 10],
            'pentatonic-major': [0, 2, 4, 7, 9],
            'pentatonic-minor': [0, 3, 5, 7, 10],
            'blues': [0, 3, 5, 6, 7, 10]
        },
        types: [
            { value: 'ionian', name: 'Ionian (Major)' },
            { value: 'dorian', name: 'Dorian' },
            { value: 'phrygian', name: 'Phrygian' },
            { value: 'lydian', name: 'Lydian' },
            { value: 'mixolydian', name: 'Mixolydian' },
            { value: 'aeolian', name: 'Aeolian (Natural Minor)' },
            { value: 'locrian', name: 'Locrian' },
            { value: 'pentatonic-major', name: 'Pentatonic Major' },
            { value: 'pentatonic-minor', name: 'Pentatonic Minor' },
            { value: 'blues', name: 'Blues' }
        ],
        specialIntervals: {
            'ionian': [4, 11],      // major 3rd and major 7th
            'dorian': [3, 9],       // minor 3rd and major 6th  
            'phrygian': [1],        // flat 2nd
            'lydian': [6],          // sharp 4th
            'mixolydian': [10],     // flat 7th
            'aeolian': [3, 8],      // minor 3rd and minor 6th
            'locrian': [6],         // diminished 5th
            'blues': [6]            // flatted 5th is the blue note
        }
    },
    intervals: {
        intervals: {
            'minor-2nd': [0, 1],
            'major-2nd': [0, 2],
            'minor-3rd': [0, 3],
            'major-3rd': [0, 4],
            'perfect-4th': [0, 5],
            'tritone': [0, 6],
            'perfect-5th': [0, 7],
            'minor-6th': [0, 8],
            'major-6th': [0, 9],
            'minor-7th': [0, 10],
            'major-7th': [0, 11]
        },
        types: [
            { value: 'minor-2nd', name: 'Minor 2nd' },
            { value: 'major-2nd', name: 'Major 2nd' },
            { value: 'minor-3rd', name: 'Minor 3rd' },
            { value: 'major-3rd', name: 'Major 3rd' },
            { value: 'perfect-4th', name: 'Perfect 4th' },
            { value: 'tritone', name: 'Tritone' },
            { value: 'perfect-5th', name: 'Perfect 5th' },
            { value: 'minor-6th', name: 'Minor 6th' },
            { value: 'major-6th', name: 'Major 6th' },
            { value: 'minor-7th', name: 'Minor 7th' },
            { value: 'major-7th', name: 'Major 7th' }
        ]
    },
    triads: {
        intervals: {
            'major': [0, 4, 7],
            'minor': [0, 3, 7],
            'diminished': [0, 3, 6],
            'augmented': [0, 4, 8]
        },
        types: [
            { value: 'major', name: 'Major' },
            { value: 'minor', name: 'Minor' },
            { value: 'diminished', name: 'Diminished' },
            { value: 'augmented', name: 'Augmented' }
        ]
    }
};

export const fretmarkPositions = {
    single: [3, 5, 7, 9, 15, 17, 19, 21, 21, 27, 29],
    double: [12, 24]
};