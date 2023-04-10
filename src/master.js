import { Audio } from "./audio.js";
import { Spatial } from "./spatial.js";
import { getSupportedAudioFormat } from "./utils.js";

/**
 * The Master class manages audio context, global controls, and audio initialization.
 */
export class Master {
  /**
   * Initializes the audio context and attaches the Master instance to the window.
   * @param {function} [onAudioContextAllowed] - Optional callback when audio context is allowed to start.
   */
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

  /**
   * Initializes a single Audio or multiple Audios.
   * @param {string|string[]|Object|Object[]} src - The audio source(s) to initialize.
   * @param {Object} [options] - Options for each sound, such as loop, start volume, etc.
   * @returns {Audio|Audio[]} The initialized Audio instance(s).
   */
  initAudio(src, name, options = {}) {
    const supportedSrc = getSupportedAudioFormat(src);
    const audio = new Audio(supportedSrc, name, options, this);
    this.sounds.push(audio);
    return audio;
  }

  /**
   * Initializes a single Spatial or multiple Spatials.
   * @param {string|string[]|Object|Object[]} src - The audio source(s) to initialize.
   * @param {Object} [options] - Options for each sound, such as loop, start volume, etc.
   * @returns {Spatial|Spatial[]} The initialized Spatial instance(s).
   */
  initSpatialAudio(src, name, options = {}) {
    const supportedSrc = getSupportedAudioFormat(src);
    const spatialAudio = new Spatial(supportedSrc, name, options, this);
    this.sounds.push(spatialAudio);
    return spatialAudio;
  }

  /**
   * Initializes a single Audio or multiple Audios.
   * @param {string|string[]|Object|Object[]} src - The audio source(s) to initialize.
   * @param {Object} [options] - Options for each sound, such as loop, start volume, etc.
   * @returns {Audio|Audio[]} The initialized Audio instance(s).
   */
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

  /**
   * Sets the global volume for all initialized Audio instances.
   * @param {number} volume - The target volume.
   */
  setGlobalVolume(volume) {
    this.globalGainNode.gain.value = volume;
  }

  /**
   * Fades the global volume for all initialized Audio instances.
   * @param {number} targetVolume - The target volume.
   * @param {number} duration - The duration of the fade in seconds.
   */
  fadeGlobalVolume(targetVolume, duration) {
    this.globalGainNode.gain.linearRampToValueAtTime(
      targetVolume,
      this.audioContext.currentTime + duration
    );
  }

  /**
   * Plays all initialized Audio instances.
   */
  playAll() {
    this.sounds.forEach((audio) => audio.play());
  }

  /**
   * Pauses all initialized Audio instances.
   */
  pauseAll() {
    this.sounds.forEach((audio) => audio.pause());
  }

  /**
   * Sets the position of a single active Spatial instance by its name or index.
   * @param {string|number} nameOrIndex - The name or index of the Spatial instance to update.
   * @param {number} x - The X position.
   * @param {number} y - The Y position.
   * @param {number} z - The Z position.
   */
  setSpatialPosition(nameOrIndex, x, y, z) {
    const audio = this.getAudioByNameOrIndex(nameOrIndex);
    if (audio instanceof Spatial) {
      audio.setPosition(x, y, z);
    }
  }

  /**
   * Updates the position of all active Spatial instances based on a single reference position.
   * @param {number} x - The X position of the reference point.
   * @param {number} y - The Y position of the reference point.
   * @param {number} z - The Z position of the reference point.
   */
  updateSpatialPositionFromPoint(nameOrIndex, point) {
    const audio = this.getAudioByNameOrIndex(nameOrIndex);
    if (audio instanceof Spatial) {
      audio.updatePositionFromPoint(point);
    }
  }

  /**
   * Updates the position of all active Spatial instances based on a single reference position.
   * @param {number} x - The X position of the reference point.
   * @param {number} y - The Y position of the reference point.
   * @param {number} z - The Z position of the reference point.
   */
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
