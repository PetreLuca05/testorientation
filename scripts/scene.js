
const videoElement = document.getElementById('cam');

let facingMode = 'environment';
let constraints = {
  audio: false,
  video: {
    facingMode
  }
};

// Fix for iOS Safari from https://leemartin.dev/hello-webrtc-on-safari-11-e8bcb5335295
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '')

navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  videoElement.srcObject = stream;
})
.catch(error => {
  alert(error);
})
