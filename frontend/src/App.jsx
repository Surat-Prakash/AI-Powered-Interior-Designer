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
    }
  };

  const handleGenerate = async () => {
    if (!image || !mask || !prompt.trim()) {
      alert("Please fill all fields");
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
    <div style={styles.container} className="arch-bg">
      <header style={styles.header}>
        <h1 style={styles.title}>INTERIOR DESIGN STUDIO</h1>
        <p style={styles.subtitle}>Reimagine spaces with AI precision</p>
      </header>

      <div style={styles.workspace}>
        <aside style={styles.sidebar}>
          <div style={styles.inputSection}>
            <h3 style={styles.sectionTitle}>Project Setup</h3>

            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Base Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.hiddenInput}
                id="fileUpload"
              />
              <label htmlFor="fileUpload" style={styles.fileInputButton}>
                {image ? image.name : "Choose Image"}
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="preview" style={styles.thumbPreview} />
              )}
            </div>

            {imagePreview && (
              <div style={styles.maskSection}>
                <label style={styles.controlLabel}>Mask Selection</label>
                <MaskCanvas image={imagePreview} setMask={setMask} />
              </div>
            )}

            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Design Brief</label>
              <textarea
                placeholder="Describe your ideal interior design..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={styles.textarea}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="generate-btn"
              style={{
                ...styles.generateBtn,
                ...(loading && styles.generateBtnLoading),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Generating...
                </>
              ) : (
                "Generate Design"
              )}
            </button>
          </div>
        </aside>

        <div style={styles.divider}></div>

        <main style={styles.canvas}>
          {result ? (
            <div style={styles.resultWrapper} className="fade-in">
              <img
                src={result}
                alt="Generated"
                style={styles.resultImage}
              />
              <p style={styles.resultLabel}>
                Generated Interior Design
              </p>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyTitle}>Ready to Design</p>
              <p style={styles.emptyText}>
                Upload an image and describe your architectural vision.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    color: "#f5f5f5",
    background: `
      radial-gradient(circle at 20% 20%, rgba(198,169,122,0.15), transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(120,90,255,0.12), transparent 40%),
      linear-gradient(135deg, #0e0e12, #141419)
    `,
  },

  /* ===== Floating Glow Layer ===== */
  glowLayer: {
    position: "absolute",
    width: "700px",
    height: "700px",
    background: "radial-gradient(circle, rgba(198,169,122,0.2), transparent 70%)",
    top: "-250px",
    right: "-250px",
    filter: "blur(120px)",
    zIndex: 0,
  },

  header: {
    padding: "32px 60px",
    backdropFilter: "blur(14px)",
    background: "rgba(20,20,24,0.6)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 1,
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
    letterSpacing: "3px",
    background: "linear-gradient(90deg,#c6a97a,#f5deb3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "13px",
    marginTop: "6px",
    color: "rgba(255,255,255,0.5)",
  },

  workspace: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "420px 1px 1fr",
    zIndex: 1,
  },

  sidebar: {
    background: "rgba(25,25,30,0.65)",
    backdropFilter: "blur(20px)",
    padding: "40px 30px",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)",
  },

  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  sectionTitle: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#c6a97a",
  },

  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  controlLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
  },

  hiddenInput: { display: "none" },

  fileInputButton: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  fileInputButtonHover: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(198,169,122,0.4)",
  },

  thumbPreview: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "12px",
    marginTop: "10px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  },

  textarea: {
    padding: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#fff",
    resize: "none",
    transition: "all 0.3s ease",
  },

  generateBtn: {
    padding: "16px",
    background: "linear-gradient(135deg,#c6a97a,#e0c28d)",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: "0 15px 40px rgba(198,169,122,0.3)",
  },

  generateBtnLoading: {
    opacity: 0.6,
    transform: "scale(0.98)",
  },

  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid #0e0e10",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
    marginRight: "8px",
  },

  divider: {
    width: "1px",
    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
  },

  canvas: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    position: "relative",
  },

  resultWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "25px",
    animation: "fadeIn 0.6s ease",
  },

  resultImage: {
    maxWidth: "85%",
    maxHeight: "80%",
    borderRadius: "18px",
    boxShadow: "0 60px 120px rgba(0,0,0,0.85)",
    transition: "transform 0.4s ease",
  },

  resultLabel: {
    fontSize: "12px",
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.4)",
  },

  emptyState: {
    textAlign: "center",
    opacity: 0.7,
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: "500",
    marginBottom: "8px",
  },

  emptyText: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.4)",
  },
};

export default App;