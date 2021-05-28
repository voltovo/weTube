const recordContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log("stream = ", stream);
  } catch (error) {
    recordBtn.innerHTML = "😭 can't record";
    recordBtn.removeEventListener("click", startRecording);
  }
};
function init() {
  recordBtn.addEventListener("click", startRecording);
}

if (recordContainer) {
  init();
}
