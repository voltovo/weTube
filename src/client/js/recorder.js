import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

/** 전역 변수 비디오 stream */
let stream;
/** 전역 변수 리코더 */
let recorder;
/** 전역 변수 녹화된 비디오 파일 */
let videoFile;

/** 비디오 파일 변수 정리 */
const files = {
  input: "recording.webm",
  output: "recording.mp4",
  thumb: "thumbnail.jpg",
};

/** 파일 다운로드 메소드 */
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

/** 비디오 초기화 */
const videoInit = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: { min: 1024 }, height: { min: 576 } },
  });
  video.srcObject = stream;
  video.play();
};
/** 비디오 다운로드 */
const handlDownload = async () => {
  // 다운로드 중 재 클릭 방지
  startBtn.removeEventListener("click", handlDownload);
  startBtn.innerText = "Transcoding....";
  startBtn.disabled = true;
  /** ffmpeg 선언 */
  const ffmpeg = createFFmpeg({ log: true });
  // 사용자 브라우저가 작동하는데 무거울 수도 있으니 기다려줘야 되서 await
  await ffmpeg.load();
  // 바이너리 데이터로 파일 만들기
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  // 만들어진 파일을 mp4파일로 변환
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
  // binary data를 사용하기 위해 buffer
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // 속도 향상을 위해 사용한 파일을 unlink
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  // 속도 향상을 위해 사용한 파일을 URL remove
  URL.revokeObjectURL(videoFile);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);

  resetClickEvent();
};

/** 비디오 녹화 버튼 재 설정 */
const resetClickEvent = () => {
  videoInit();
  startBtn.innerText = "Start Recording";
  startBtn.disabled = false;
  startBtn.addEventListener("click", handleStart);
};

/** 비디오 녹화 종료 */
const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handlDownload);

  recorder.stop();
};

/** 비디오 녹화 시작 */
const handleStart = () => {
  startBtn.innerText = "Recording";
  startBtn.disabled = true;
  startBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    startBtn.innerText = "Download";
    startBtn.disabled = false;
    startBtn.addEventListener("click", handlDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

videoInit();
startBtn.addEventListener("click", handleStart);
