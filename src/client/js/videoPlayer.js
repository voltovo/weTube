const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

let globalVolume = 0.5;
video.volume = globalVolume;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Paused");

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : globalVolume;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    muteBtn.innerText = "Mute";
    video.muted = false;
  }
  globalVolume = value;
  video.volume = value;
};

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetadata = () => {
  // const minutes = Math.floor(video.duration / 60);
  // let seconds = Math.floor(video.duration - minutes * 60);
  // seconds = seconds < 10 ? "0" + seconds : seconds;
  // totalTime.innerText = minutes + ":" + seconds;
  totalTime.innerText = formatTime(Math.floor(video.duration));
};

const handleTimeUpdate = () => {
  // const videoPlayTime = Math.floor(video.currentTime);
  // let currentMinutes = Math.floor(videoPlayTime / 60);
  // let currentSeconds = videoPlayTime;
  // if (currentMinutes > 0) {
  //   currentSeconds = currentSeconds - currentMinutes * 60;
  // }
  // currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
  // currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
  // currentTime.innerText = currentMinutes + ":" + currentSeconds;
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("change", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
