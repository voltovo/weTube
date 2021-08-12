import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recoder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  startBtn.removeEventListener("click", handleDownload);
  startBtn.innerText = "Transcoding ...";
  startBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "My Recording.mp4");
  // const a = document.createElement("a");
  // a.href = mp4Url;
  // a.download = "My Recording.mp4";
  // document.body.appendChild(a);
  // a.click();

  downloadFile(thumbUrl, "My Thumbnail.jpg");
  // const thumbA = document.createElement("a");
  // thumbA.href = thumbUrl;
  // thumbA.download = "My Thumbnail.jpg";
  // document.body.appendChild(thumbA);
  // thumbA.click();

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Blob);
  URL.revokeObjectURL(mp4File);
  URL.revokeObjectURL(videoFile);

  startBtn.disabled = false;
  startBtn.innerText = "Record Again";
  init();
  startBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  startBtn.innerText = "Download Recoding";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recoder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recoding";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recoder = new MediaRecorder(stream, { MimeType: "video/webm" });
  recoder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recoder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
