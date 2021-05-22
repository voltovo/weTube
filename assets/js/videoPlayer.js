const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumBtn = document.getElementById("jsVolumBtn");
const fullscrnBtn = document.getElementById("jsFullScreen");

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    videoPlayer.muted = true;
    volumBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function exitFullScreen() {
  fullscrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullscrnBtn.addEventListener("click", goFullScreen);
  document.exitFullscreen().catch((err) => Promise.resolve(err));
}

function goFullScreen() {
  videoContainer.requestFullscreen();
  fullscrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullscrnBtn.removeEventListener("click", goFullScreen);
  fullscrnBtn.addEventListener("click", exitFullScreen);
}

function init() {
  playBtn.addEventListener("click", handlePlayClick);
  volumBtn.addEventListener("click", handleVolumeClick);
  fullscrnBtn.addEventListener("click", goFullScreen);
}

if (videoContainer) {
  init();
}
