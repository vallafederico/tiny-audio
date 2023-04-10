# Tiny Audio

## Overview

Tiny Audio is a simple, ultra-optimized library for handling sound on the web. It is designed with a focus on memory efficiency and performance. The library consists of a Master class, Audio class, Spatial class, and shared utility functions.

## Initialization

To use Tiny Audio, import the required classes from their respective files, and create instances of the classes as needed. The Master class will automatically attach itself to the window object and wait for the audio context to be allowed to start.

### Master Class

The `Master` class holds the audio context and can be created only once. It attaches itself to the window with the window.audioMaster name. It provides global controls for all the initialized Audio instances, such as controlling global volume, playing, and pausing all sounds.

You can initialize `Audio` instances from the `Master` class by providing a single src or an array of objects with a src (that can be a single source or an array of different format sources) and a name. You can control the individual sound by calling the Master class and specifying the name of the sound.

| Function                                          | Description                                                                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constructor()`                                   | Instantiates the Master class. This class can only be created once and is attached to the `window` object with the name `window.audioMaster`.                         |
| `initAudios(audioData)`                           | Initializes one or more Audio instances based on the provided `audioData`. `audioData` can be a single object, an array of objects, or an array of arrays of objects. |
| `play(nameOrIndex)`                               | Plays the audio with the specified name or index.                                                                                                                     |
| `pause(nameOrIndex)`                              | Pauses the audio with the specified name or index.                                                                                                                    |
| `setVolume(nameOrIndex, volume)`                  | Sets the volume for the audio with the specified name or index.                                                                                                       |
| `fadeVolume(nameOrIndex, targetVolume, duration)` | Fades the volume of the audio with the specified name or index to the target volume over the specified duration.                                                      |
| `playAll()`                                       | Plays all initialized audios.                                                                                                                                         |
| `pauseAll()`                                      | Pauses all initialized audios.                                                                                                                                        |
| `setGlobalVolume(volume)`                         | Sets the global volume for all audios.                                                                                                                                |
| `fadeGlobalVolume(targetVolume, duration)`        | Fades the global volume to the target volume over the specified duration.                                                                                             |
| `setSpatialPosition(nameOrIndex, x, y, z)`        | Sets the position of the Spatial audio with the specified name or index.                                                                                              |
| `updateAllSpatialPositions(referencePoint)`       | Updates the position of all active Spatial audios based on the provided reference point.                                                                              |

### Audio Class

The `Audio` class represents a single `Audio` item, which can have a single src or an array of different audio formats. An instance of the `Audio` class can play, pause, and set the volume of the sound, as well as fade the volume over time.

Every Audio instance attaches itself automatically to the Master class and creates it if it doesn't exist.

| Function                                  | Description                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `constructor(src, name, options, master)` | Instantiates the Audio class with the specified `src`, `name`, `options`, and `master` reference.              |
| `loadAudio(url, callback)`                | Loads the audio file from the specified `url` and calls the `callback` function with the decoded audio buffer. |
| `play()`                                  | Plays the audio instance.                                                                                      |
| `pause()`                                 | Pauses the audio instance.                                                                                     |
| `setVolume(volume)`                       | Sets the volume for the audio instance.                                                                        |
| `fadeVolume(targetVolume, duration)`      | Fades the volume of the audio instance to the target volume over the specified duration.                       |

### Spatial Class

The `Spatial` class extends the `Audio` class, adding the ability to spatialize the audio with controls for setting the position. You can set the spatial position from a given point in space or use the default position (0, 0, 0).

| Function                                  | Description                                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `constructor(src, name, options, master)` | Instantiates the Spatial class with the specified `src`, `name`, `options`, and `master` reference, extending the Audio class. |
| `setPosition(x, y, z)`                    | Sets the position of the Spatial audio instance with the specified `x`, `y`, and `z` coordinates.                              |
| `setPositionFromPoint(point)`             | Sets the position of the Spatial audio instance using the provided `point` object with `x`, `y`, and `z` properties.           |

## Examples

```javascript
import { Master, Audio, Spatial } from "./audio.js";
```

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
