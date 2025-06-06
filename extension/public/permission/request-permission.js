/**
 * requestPermission.ts
 * Requests user permission for microphone access.
 * @returns {Promise<void>} A Promise that resolves when permission is granted or rejects with an error.
 */
export async function getUserPermission() {
  return new Promise((resolve, reject) => {
    // Using navigator.mediaDevices.getUserMedia to request microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Permission granted, handle the stream if needed
        console.log("Microphone access granted");

        // Stop the tracks to prevent the recording indicator from being shown
        stream.getTracks().forEach(function (track) {
          track.stop();
        });

        resolve();
      })
      .catch((error) => {
        console.error("Error requesting microphone permission", error);

        reject(error);
      });
  });
}

window.addEventListener("message", async (event) => {
  if (event.data.type === "REQUEST_MICROPHONE_PERMISSION") {
    await getUserPermission();
  }
});
