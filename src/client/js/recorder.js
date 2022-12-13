const startBtn = document.getElementById("startBtn");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: { min: 1280 }, height: { min: 720 } },
  });
  console.log("stream = ", stream);
};

startBtn.addEventListener("click", handleStart);
