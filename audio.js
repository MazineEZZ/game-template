class AudioSystem {
  constructor() {
    this.song = [];

    this.collect = new Audio("assets/sounds/collect.mp3");
    this.song.push(this.collect);
  }
  adjustVolume(volume = 0.4) {
    this.song.forEach((song) => (song.volume = volume));
  }
  playCollect() {
    this.collect.play();
  }
}

export { AudioSystem };
