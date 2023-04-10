import "./style.css";
import { Master, Audio, Spatial } from "../src/index.js";

// import sound1wav from "./src/sound/eating.wav";
import sound1mp from "./src/sound/eating.mp3";

const mySound = new Audio([sound1mp], "mySound", {
  loop: true,
  volume: 0.5,
});

document.onclick = () => {
  // console.log("playing");
  mySound.play();

  setTimeout(() => {
    console.log("fade to .2");
    // Set the volume to 50%
    // mySound.setVolume(0.9);
    // mySound.play();
    mySound.fadeVolume(0.0, 2);

    setTimeout(() => {
      console.log("fade to 1");
      mySound.fadeVolume(1, 5);
    }, 3000);
  }, 3000);
};
