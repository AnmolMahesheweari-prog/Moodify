import { useEffect } from "react";
import { useFace } from "../hooks/useFace";
import "../style/main.scss";

export default function ExpressionDetector() {
  const {
    startDetector,
    detectOnce,
    videoRef,
    error,
    expression,
    status,
    ready,
  } = useFace();

  useEffect(() => {
    const cleanup = startDetector();

    return cleanup;
  }, []);

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
