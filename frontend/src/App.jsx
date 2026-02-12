import { useState, useRef } from "react";
import axios from "axios";
import MaskCanvas from "./components/MaskCanvas";

function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mask, setMask] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previousResultRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleGenerate = async () => {
    if (!image || !mask || !prompt.trim()) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", image);
    formData.append("mask", mask);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/generate",
        formData,
        { responseType: "blob" }
      );

      if (previousResultRef.current) {
        URL.revokeObjectURL(previousResultRef.current);
      }

      const imageURL = URL.createObjectURL(response.data);
      previousResultRef.current = imageURL;
      setResult(imageURL);
    } catch (err) {
      console.error(err);
      alert("Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>AI Interior Designer</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Upload Base Image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "block" }}
        />
        {image && <p style={{ marginTop: "8px", color: "green" }}>✓ {image.name}</p>}
      </div>

      {imagePreview && (
        <MaskCanvas image={imagePreview} setMask={setMask} />
      )}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Design Prompt:
        </label>
        <input
          type="text"
          placeholder="e.g., Modern furniture, wooden floor, bright lighting"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Generating..." : "Generate Design"}
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Generated Result:</h3>
          <img src={result} alt="result" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
    </div>
  );
}

export default App;
