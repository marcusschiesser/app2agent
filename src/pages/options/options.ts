navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(() => {
    window.close();
  })
  .catch((error) => {
    console.error("Microphone access denied:", error);
  });
