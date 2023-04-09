// Add this import at the beginning of the file
// import { Audio } from './audio.js';
// import { Spatial } from './spatial.js';
// import { getSupportedAudioFormat } from './utils.js';

class Master {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.sounds = [];
    this.globalGainNode = this.audioContext.createGain();
    this.globalGainNode.connect(this.audioContext.destination);

    // Auto initialize and attach to window object
    this.autoInitialize();
  }

  async autoInitialize() {
    // Attach the Master instance to the window object
    window.audioMaster = this;

    // Wait for the audio context to be allowed to start
    if (this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (err) {
        console.error("Audio context could not be resumed:", err);
      }
    }

    // Optional callback when the audio context is allowed to start
    if (typeof this.onContextReady === "function") {
      this.onContextReady();
    }
  }

  initAudio(src, name, options = {}) {
    const supportedSrc = getSupportedAudioFormat(src);
    const audio = new Audio(supportedSrc, name, options, this);
    this.sounds.push(audio);
    return audio;
  }

  initSpatialAudio(src, name, options = {}) {
    const supportedSrc = getSupportedAudioFormat(src);
    const spatialAudio = new Spatial(supportedSrc, name, options, this);
    this.sounds.push(spatialAudio);
    return spatialAudio;
  }

  initAudios(audios) {
    if (!Array.isArray(audios)) {
      audios = [audios];
    }

    audios.forEach((audio) => {
      const { src, name, options, type } = audio;
      if (type === "spatial") {
        this.initSpatialAudio(src, name, options);
      } else {
        this.initAudio(src, name, options);
      }
    });
  }

  getAudioByNameOrIndex(nameOrIndex) {
    if (typeof nameOrIndex === "number") {
      return this.sounds[nameOrIndex];
    } else {
      return this.sounds.find((audio) => audio.name === nameOrIndex);
    }
  }

  setGlobalVolume(volume) {
    this.globalGainNode.gain.value = volume;
  }

  fadeGlobalVolume(targetVolume, duration) {
    this.globalGainNode.gain.linearRampToValueAtTime(
      targetVolume,
      this.audioContext.currentTime + duration
    );
  }

  playAll() {
    this.sounds.forEach((audio) => audio.play());
  }

  pauseAll() {
    this.sounds.forEach((audio) => audio.pause());
  }

  setSpatialPosition(nameOrIndex, x, y, z) {
    const audio = this.getAudioByNameOrIndex(nameOrIndex);
    if (audio instanceof Spatial) {
      audio.setPosition(x, y, z);
    }
  }

  updateSpatialPositionFromPoint(nameOrIndex, point) {
    const audio = this.getAudioByNameOrIndex(nameOrIndex);
    if (audio instanceof Spatial) {
      audio.updatePositionFromPoint(point);
    }
  }

  updateAllSpatialPositions(referencePoint) {
    const soundsLength = this.sounds.length;
    for (let i = 0; i < soundsLength; i++) {
      const audio = this.sounds[i];
      if (audio instanceof Spatial) {
        audio.updatePositionFromPoint(referencePoint);
      }
    }
  }
}
