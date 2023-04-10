/**
 * Checks the provided audio sources and returns the best one supported by the current browser.
 * @param {string|string[]} src - A single or an array of audio sources.
 * @returns {string} The best supported audio source for the current browser.
 */
function getSupportedAudioFormat(src) {
  if (typeof src === "string") {
    return src;
  }

  const audio = new window.Audio();

  for (let i = 0; i < src.length; i++) {
    const format = src[i].split(".").pop();
    const canPlay = audio.canPlayType(`audio/${format}`);
    if (canPlay === "probably" || canPlay === "maybe") {
      return src[i];
    }
  }

  console.error("No compatible audio format found in the provided sources.");
  return null;
}

export { getSupportedAudioFormat };
