import { useRef, useState, useEffect } from "react";

function MaskCanvas({ image, setMask }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [isMaskMode, setIsMaskMode] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [image]);

  const startDrawing = () => {
    if (!isMaskMode) return;
    setDrawing(true);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing || !isMaskMode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = "rgba(255,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const exportMask = () => {
    const canvas = canvasRef.current;

    canvas.toBlob((blob) => {
      setMask(blob);
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMaskMode(!isMaskMode)}
        style={{
          marginBottom: "10px",
          padding: "8px 15px",
          backgroundColor: isMaskMode ? "#ff4d4d" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {isMaskMode ? "Disable Masking" : "Enable Masking"}
      </button>

      <div style={{ position: "relative", display: "inline-block" }}>
        <img src={image} alt="base" width="512" />

        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: isMaskMode ? "crosshair" : "default",
            pointerEvents: isMaskMode ? "auto" : "none"
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
        />
      </div>

      {/* Controls */}
      <div style={{ marginTop: "10px" }}>
        <label>Brush Size: </label>
        <input
          type="range"
          min="5"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={clearMask}>Clear</button>
        <button onClick={exportMask} style={{ marginLeft: "10px" }}>
          Save Mask
        </button>
      </div>
    </div>
  );
}

export default MaskCanvas;
