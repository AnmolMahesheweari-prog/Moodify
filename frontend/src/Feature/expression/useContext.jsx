import { createContext, useRef, useState } from "react";

export const FaceContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [error, setError] = useState("");
  const [expression, setExpression] = useState("Not detected");
  const [status, setStatus] = useState("Loading MediaPipe...");
  const [ready, setReady] = useState(false);

  const value = {
    videoRef,
    landmarkerRef,
    error,
    setError,
    expression,
    setExpression,
    status,
    setStatus,
    ready,
    setReady,
  };

  return <FaceContext.Provider value={value}>{children}</FaceContext.Provider>;
};
