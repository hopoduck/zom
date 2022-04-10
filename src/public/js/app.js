const socket = io();

const myFace = document.querySelector("#myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const camerasSelect = document.querySelector("#cameras");

let myStream;
let cameraOff = true;
let muted = false;

async function getCamera() {
  try {
    const devieces = await navigator.mediaDevices.enumerateDevices();
    const cameras = devieces.filter((device) => device.kind === "videoinput");
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
    console.log(devieces, cameras);
  } catch (error) {
    console.error(error);
  }
}

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
    console.log(myStream);
  } catch (error) {
    console.error(error);
  }
}

function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn camera off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn camera on";
    cameraOff = true;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);

getMedia();
getCamera();
