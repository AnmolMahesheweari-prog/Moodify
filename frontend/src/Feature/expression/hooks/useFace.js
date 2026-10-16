import { useContext } from "react";
import { FaceContext } from "../useContext";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

function getScore(scores, name) {
  return scores[name] ?? 0;
}

function detectExpression(scores) {
  const smile =
    (getScore(scores, "mouthSmileLeft") + getScore(scores, "mouthSmileRight")) /
    2;

  const frown =
    (getScore(scores, "mouthFrownLeft") + getScore(scores, "mouthFrownRight")) /
    2;

  const browDown =
    (getScore(scores, "browDownLeft") + getScore(scores, "browDownRight")) / 2;

  const eyeWide =
    (getScore(scores, "eyeWideLeft") + getScore(scores, "eyeWideRight")) / 2;

  const browInnerUp = getScore(scores, "browInnerUp");
  const jawOpen = getScore(scores, "jawOpen");

  const mouthPress =
    (getScore(scores, "mouthPressLeft") + getScore(scores, "mouthPressRight")) /
    2;

  if (jawOpen > 0.45 && (eyeWide > 0.25 || browInnerUp > 0.3)) {
    return "😮 Surprised";
  }

  if (smile > 0.45) return "😊 Happy / smiling";

  if (frown > 0.3 && browInnerUp > 0.33) {
    return "😟 Sad-like expression";
  }

  if (browDown > 0.45 && mouthPress > 0.25) {
    return "😠 Angry-like expression";
  }

  if (jawOpen > 0.35) return "😮 Mouth open";

  return "😐 Neutral / unclear";
}

export const useFace = () => {
  const context = useContext(FaceContext);

  if (!context) {
    throw new Error("useFace must be used inside ContextProvider.");
  }

  const {
    videoRef,
    landmarkerRef,
    setError,
    setExpression,
    setStatus,
    setReady,
  } = context;

  async function createFaceLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(WASM_URL);

    return FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
    });
  }

  // Start camera and return a cleanup function
  function startDetector() {
    let stopped = false;
    let stream = null;
    let landmarker = null;

    async function initialize() {
      try {
        setError("");
        setReady(false);
        setStatus("Loading face model...");

        landmarker = await createFaceLandmarker();

        if (stopped) {
          landmarker.close();
          landmarker = null;
          return;
        }

        landmarkerRef.current = landmarker;

        setStatus("Requesting camera permission...");

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (stopped) {
          stream.getTracks().forEach((track) => track.stop());
          stream = null;
          return;
        }

        const video = videoRef.current;

        if (!video) {
          throw new Error("Video element not found.");
        }

        video.srcObject = stream;
        await video.play();

        if (stopped) return;

        setReady(true);
        setStatus("Camera ready — click the button to detect");
      } catch (err) {
        console.error(err);

        if (!stopped) {
          setStatus("Detector failed");
          setError(
            err.name === "NotAllowedError"
              ? "Camera permission denied. Please allow camera access."
              : err.message || "Could not start the face detector.",
          );

          setReady(false);
        }
      }
    }

    initialize();

    // This cleanup is returned synchronously to useEffect
    return () => {
      stopped = true;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (landmarker) {
        landmarker.close();
        landmarker = null;
      }

      landmarkerRef.current = null;
      setReady(false);
    };
  }

  // Run detection only when the button is clicked
  function detectOnce() {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !landmarker || video.readyState < 2) {
      setError("Camera is not ready yet. Please wait.");
      return;
    }

    try {
      const result = landmarker.detectForVideo(video, performance.now());

      const categories = result.faceBlendshapes?.[0]?.categories;

      if (!result.faceLandmarks?.length || !categories) {
        setExpression("No face detected");
        setError("");
        return;
      }

      const scores = Object.fromEntries(
        categories.map(({ categoryName, score }) => [categoryName, score]),
      );

      setExpression(detectExpression(scores));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Face detection failed. Please try again.");
    }
  }

  return {
    startDetector,
    detectOnce,
    ...context,
  };
};
