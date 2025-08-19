### Intro

An interactive fretboard made mostly based on the version of another github user "musicandcode".
I followed his wise teachings, expanded on his concept, and refactored it to suit my style. 

I was looking for a tool like this, and I saw some paid versions, which I got annoyed by and thought "I'm pretty sure I can make this myself"
So here it is. It's free baby.

### Features

- Interactive fretboard, shows the right note when you hover over the fret/string.
- Change instrument (Guitar, Bass (4/5 strings), Ukulele)
- Switch between viewing sharps/flats.
- The option to show all notes on the neck
- The option to show all the instances of where the note occurs on the neck (multiple mode)
- The option to just show the note you are hovering over (single mode, default)
- Scale mode which includes the 5 modes, and major/minor pentatonic.
- Triad mode, which includes the 4 basic types of triads. Major, Minor, Augmented, Diminished.
- An interactive note display on the bottom, which also changes to the notes of a scale/triad when selected.

### How to use it

Simply download this repository, and open the "index.html" file using any browser. I might add some kind of bundler in the future but not sure.

### Tech stack

Literally as bare-bones as it gets. The fretboard is made using CSS, with a texture image over it to give it that woody look.
Almost everything is done in plain Javascript, and it uses no back-end or anything like that.

### Future ideas ???

Might look into integrating Tonal.js for later functionalities which is a pretty cool music library. Writing it here so I don't forget about it. But right now I just kept it pretty simple, 
calculating scales and triads by simply using the intervals.
