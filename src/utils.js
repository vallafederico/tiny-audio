/**
 * Returns the first supported audio format in the provided list of sources.
 *
 * @param {string[]} sources - An array of audio sources with different formats.
 * @returns {string|null} The first supported audio source or null if none are supported.
 */
export function getSupportedAudioFormat(sources) {
  const audioElement = document.createElement("audio");
  for (const source of sources) {
    const ext = source.split(".").pop().toLowerCase();
    const type = getMimeType(ext);
    if (type && audioElement.canPlayType(type)) {
      return source;
    }
  }
  return null;
}

/**
 * Returns the MIME type corresponding to the provided file extension.
 *
 * @param {string} extension - The file extension of the audio format.
 * @returns {string|null} The MIME type for the provided extension or null if the extension is not recognized.
 */
function getMimeType(extension) {
  const mimeTypes = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    aac: "audio/aac",
    webm: "audio/webm",
    flac: "audio/flac",
  };
  return mimeTypes[extension] || null;
}
