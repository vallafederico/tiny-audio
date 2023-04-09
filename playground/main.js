import "./style.css";
import { Master, Sound, SpatialSound } from "../src/index.js";

// console.log(Master, Sound, SpatialSound);

import sound1 from "./src/sound/eating.wav";

const master = new Master();
master.initializeSounds([
  {
    name: "sound1",
    src: sound1,
    options: { volume: 0.5, loop: true, autoPlay: true },
  },
]);

document.onclick = () => {
  master.play("sound1");

  setTimeout(() => {
    master.setSoundVolume("sound1", 1);
    console.log("sound volume");
  }, 5000);
};
