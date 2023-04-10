import { Audio } from "./audio.js";

/**
 * The Spatial class extends the Audio class and adds spatialization functionality.
 */
export class Spatial extends Audio {
  /**
   * Creates a new Spatial instance.
   * @param {string|string[]} src - The audio source(s) for the sound.
   * @param {string|number} [name] - The name or index of the sound. If not provided, the index will be used as the name.
   * @param {Object} [options] - Options for the sound, such as loop, start volume, etc.
   * @param {Master} [master] - The Master instance to attach this Audio instance to. If not provided, it will use or create the global Master instance.
   */
  constructor(src, name, options = {}, master = null) {
    super(src, name, options, master);

    this.pool.forEach((poolEntry) => {
      const pannerNode = this.master.audioContext.createPanner();
      pannerNode.panningModel = "HRTF";
      pannerNode.distanceModel = "inverse";
      pannerNode.refDistance = 1;
      pannerNode.maxDistance = 10000;
      pannerNode.rolloffFactor = 1;
      pannerNode.coneInnerAngle = 360;
      pannerNode.coneOuterAngle = 0;
      pannerNode.coneOuterGain = 0;

      poolEntry.source.disconnect(poolEntry.gainNode);
      poolEntry.source.connect(pannerNode);
      pannerNode.connect(poolEntry.gainNode);

      poolEntry.pannerNode = pannerNode;
    });
  }

  /**
   * Sets the position of the spatial sound for all instances in the pool.
   * @param {number} x - The X position.
   * @param {number} y - The Y position.
   * @param {number} z - The Z position.
   */
  setPosition(x, y, z) {
    this.pool.forEach((poolEntry) => {
      poolEntry.pannerNode.setPosition(x, y, z);
    });
  }

  /**
   * Sets the position of the spatial sound from a given point in space for all instances in the pool.
   * @param {Object} point - The point in space with x, y, and z properties.
   */
  setPositionFromPoint(point) {
    this.setPosition(point.x, point.y, point.z);
  }
}
