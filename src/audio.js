import { Master } from "./master.js";
import { getSupportedAudioFormat } from "./utils.js";

/**
 * The Audio class represents a single audio item and provides methods to control it.
 */
export class Audio {
  /**
   * Creates a new Audio instance.
   * @param {string|string[]} src - The audio source(s) for the sound.
   * @param {string|number} [name] - The name or index of the sound. If not provided, the index will be used as the name.
   * @param {Object} [options] - Options for the sound, such as loop, start volume, etc.
   * @param {Master} [master] - The Master instance to attach this Audio instance to. If not provided, it will use or create the global Master instance.
   */
  constructor(src, name, options = {}, master = null) {
    if (!master) {
      master = window.audioMaster || new Master();
    }
    this.master = master;
    this.name = name || this.master.sounds.length;

    const supportedSrc = getSupportedAudioFormat(src);
    this.buffer = null;
    this.pool = [];
    this.poolSize = options.poolSize || 3;
    this.poolIndex = 0;

    this.loadAudio(supportedSrc, (buffer) => {
      this.buffer = buffer;

      for (let i = 0; i < this.poolSize; i++) {
        const source = this.master.audioContext.createBufferSource();
        const gainNode = this.master.audioContext.createGain();
        source.buffer = buffer;
        source.loop = options.loop || false;
        source.connect(gainNode);
        gainNode.connect(this.master.globalGainNode);

        this.pool.push({
          source: source,
          gainNode: gainNode,
          isPlaying: false,
        });
      }
    });
  }

  /**
   * Loads an audio file and initializes the audio buffer and pool.
   * @param {string} url - The URL of the audio file.
   * @param {function} callback - The callback function to execute after loading and decoding the audio.
   */
  loadAudio(url, callback) {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      this.master.audioContext.decodeAudioData(request.response, (buffer) => {
        if (!buffer) {
          console.error("Error decoding audio data:", url);
          return;
        }
        callback(buffer);
      });
    };

    request.onerror = () => {
      console.error("Error loading audio:", url);
    };

    request.send();
  }

  /**
   * Plays the audio, using the next available entry in the pool.
   */
  play() {
    if (!this.buffer) return;

    const poolEntry = this.pool[this.poolIndex];
    if (poolEntry.isPlaying) {
      poolEntry.source.stop();
    }

    poolEntry.source = this.master.audioContext.createBufferSource();
    poolEntry.source.buffer = this.buffer;
    poolEntry.source.loop = poolEntry.source.loop;
    poolEntry.source.connect(poolEntry.gainNode);
    poolEntry.source.start();

    poolEntry.isPlaying = true;

    this.poolIndex = (this.poolIndex + 1) % this.poolSize;
  }

  /**
   * Pauses all playing instances of the audio in the pool.
   */
  pause() {
    this.pool.forEach((poolEntry) => {
      if (poolEntry.isPlaying) {
        poolEntry.source.stop();
        poolEntry.isPlaying = false;
      }
    });
  }

  /**
   * Sets the volume for all instances of the audio in the pool.
   * @param {number} volume - The target volume.
   */
  setVolume(volume) {
    this.pool.forEach((poolEntry) => {
      poolEntry.gainNode.gain.value = volume;
    });
  }

  /**
   * Fades the volume for all instances of the audio in the pool.
   * @param {number} targetVolume - The target volume.
   * @param {number} duration - The duration of the fade in seconds.
   */
  fadeVolume(targetVolume, duration) {
    this.pool.forEach((poolEntry) => {
      poolEntry.gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        this.master.audioContext.currentTime + duration
      );
    });
  }
}
