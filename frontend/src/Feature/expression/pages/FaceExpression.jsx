import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import "../style/main.scss";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

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

  if (smile > 0.45) {
    return "😊 Happy / smiling";
  }

  if (frown > 0.03 && browInnerUp > 0.03) {
    return "😟 Sad-like expression";
  }

  if (browDown > 0.45 && mouthPress > 0.25) {
    return "😠 Angry-like expression";
  }

  if (jawOpen > 0.35) {
    return "😮 Mouth open";
  }

  return "😐 Neutral / unclear";
}

export default function ExpressionDetector() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [expression, setExpression] = useState("Not detected");
  const [status, setStatus] = useState("Loading MediaPipe...");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stream;
    let stopped = false;
    let landmarker;

    async function startDetector() {
      try {
        setStatus("Loading face model...");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        });

        if (stopped) {
          landmarker.close();
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
          return;
        }

        const video = videoRef.current;
        video.srcObject = stream;

        await video.play();

        if (stopped) return;

        setReady(true);
        setStatus("Camera ready — click the button to detect");
      } catch (err) {
        console.error(err);

        if (!stopped) {
          setError(
            err.name === "NotAllowedError"
              ? "Camera permission denied. Allow camera access."
              : err.message || "Could not start the face detector.",
          );
          setStatus("Detector failed");
        }
      }
    }

    startDetector();

    return () => {
      stopped = true;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (landmarker) {
        landmarker.close();
      }

      landmarkerRef.current = null;
    };
  }, []);

  // Detection happens only when the button is clicked.
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
        return;
      }

      const scores = Object.fromEntries(
        categories.map(({ categoryName, score }) => [categoryName, score]),
      );

      const detectedExpression = detectExpression(scores);

      setExpression(detectedExpression);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Face detection failed. Please try again.");
    }
  }

  return (
    <div className="expression-app">
      <h1>Face Expression Detector</h1>

      <p className="detector-status">{status}</p>

      <div className="camera-box">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          muted
          playsInline
        />
      </div>

      <div className="expression-result">
        <span>Expression estimate</span>
        <h2>{expression}</h2>

        <button onClick={detectOnce} disabled={!ready}>
          Detect Expression
        </button>
      </div>

      {error && <p className="detector-error">{error}</p>}

      <p className="detector-note">
        This demo estimates visible facial movements. It cannot reliably
        determine someone's actual feelings.
      </p>
    </div>
  );
}
