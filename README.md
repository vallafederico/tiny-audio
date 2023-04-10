# Tiny Audio

## Overview
Tiny Audio is a simple, ultra-optimized library for handling sound on the web. It is designed with a focus on memory efficiency and performance. The library consists of a Master class, Audio class, Spatial class, and shared utility functions.

### Master Class

The Master class holds the audio context and can be created only once. It attaches itself to the window with the window.audioMaster name. It provides global controls for all the initialized Audio instances, such as controlling global volume, playing, and pausing all sounds.

You can initialize Audio instances from the Master class by providing a single src or an array of objects with a src (that can be a single source or an array of different format sources) and a name. You can control the individual sound by calling the Master class and specifying the name of the sound.

### Audio Class

The Audio class represents a single Audio item, which can have a single src or an array of different audio formats. An instance of the Audio class can play, pause, and set the volume of the sound, as well as fade the volume over time.

Every Audio instance attaches itself automatically to the Master class and creates it if it doesn't exist.

### Spatial Class

The Spatial class extends the Audio class, adding the ability to spatialize the audio with controls for setting the position. You can set the spatial position from a given point in space or use the default position (0, 0, 0).

## Initialization
To use Tiny Audio, import the required classes from their respective files, and create instances of the classes as needed. The Master class will automatically attach itself to the window object and wait for the audio context to be allowed to start.

## Example Usage

### Single Audio Instance

```javascript
import { Audio } from "./audio.js";

const mySound = new Audio("path/to/your/audio/file.mp3", "mySound");

// Play the sound
mySound.play();

// Pause the sound
mySound.pause();

// Set the volume to 50%
mySound.setVolume(0.5);

// Fade the volume to 20% over 2 seconds
mySound.fadeVolume(0.2, 2);
```

### Multiple Audio Instance

```javascript
import { Master } from "./master.js";

const audioMaster = new Master();

const sound1 = audioMaster.initAudios({
  src: "path/to/sound1.mp3",
  name: "sound1",
});
const sound2 = audioMaster.initAudios({
  src: "path/to/sound2.mp3",
  name: "sound2",
});

// Play sound1
audioMaster.play("sound1");

// Pause sound2
audioMaster.pause("sound2");

// Set the volume of sound1 to 30%
audioMaster.setVolume("sound1", 0.3);
```

### Initializing multiple Audio instances from an array

```javascript
import { Master } from "./master.js";

const audioMaster = new Master();

const sounds = [
  { src: "path/to/sound1.mp3", name: "sound1" },
  { src: "path/to/sound2.mp3", name: "sound2" },
];

audioMaster.initAudios(sounds);

// Play sound1
audioMaster.play("sound1");

// Pause sound2
audioMaster.pause("sound2");
```

### Initializing and controlling Spatial Audio instances

```javascript
import { Spatial } from "./spatial.js";

const mySpatialSound = new Spatial(
  "path/to/your/spatial/audio/file.mp3",
  "mySpatialSound"
);

// Play the spatial sound
mySpatialSound.play();

// Set the spatial sound position to (x: 10, y: 5, z: -3)
mySpatialSound.setPosition(10, 5, -3);

// Set the spatial sound position using a point object
const point = { x: 2, y: 0, z: 5 };
mySpatialSound.setPositionFromPoint(point);
```

### Initializing multiple Spatial Audio instances using the Master class

```javascript
import { Master } from "./master.js";

const audioMaster = new Master();

const spatialSound1 = audioMaster.initSpatialAudios({
  src: "path/to/spatial1.mp3",
  name: "spatial1",
});
const spatialSound2 = audioMaster.initSpatialAudios({
  src: "path/to/spatial2.mp3",
  name: "spatial2",
});

// Set the position of spatialSound1
audioMaster.setSpatialPosition("spatial1", 5, 10, -2);

// Update the position of all active spatial sounds with a reference position
const referencePosition = { x: 0, y: 0, z: 0 };
audioMaster.updateAllSpatialPositions(referencePosition);
```
