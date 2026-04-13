import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState("modern");
  const [results, setResults] = useState([]);
  const [palettes, setPalettes] = useState([]); // 🎨 NEW
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!image) return alert("Upload image");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("style", style);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/generate",
        formData
      );

      // ✅ GET BOTH
      const blobImages = res.data.images.map((base64) => {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: "image/png" });
  return URL.createObjectURL(blob);
});

setResults(blobImages);
setPalettes(res.data.palettes);

    } catch (err) {
      alert("Error generating design");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Interior Designer</h1>

      <div style={styles.card}>
        {/* LEFT */}
        <div style={styles.left}>
          <label style={styles.uploadBox}>
            {preview ? (
              <img src={preview} style={styles.preview} />
            ) : (
              <span>Upload Room Image</span>
            )}
            <input type="file" hidden onChange={handleImage} />
          </label>

          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={styles.input}
          >
            <option value="modern">Modern</option>
            <option value="luxury">Luxury</option>
            <option value="minimalist">Minimalist</option>
            <option value="indian">Indian</option>
          </select>

          <button style={styles.button} onClick={handleGenerate}>
            {loading ? "Generating..." : "Generate Design"}
          </button>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          {results.length > 0 ? (
            <div style={styles.grid}>
              {results.map((img, i) => (
                <div key={i} style={styles.resultCard}>
                  <img src={img} style={styles.resultImg} />

                  {/* 🎨 COLOR PALETTE */}
                  <div style={styles.palette}>
                    {palettes[i]?.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.colorBox,
                          backgroundColor: color
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.6 }}>
              Upload image → Select style → Generate
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    padding: "40px",
    fontFamily: "sans-serif",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    marginBottom: "30px",
    fontWeight: "600",
  },

  card: {
    display: "flex",
    gap: "30px",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  },

  left: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  right: {
    flex: 1,
  },

  uploadBox: {
    height: "200px",
    border: "2px dashed #ccc",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
  },

  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  button: {
    padding: "14px",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "20px",
  },

  resultCard: {
    background: "#fff",
    borderRadius: "15px",
    padding: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  resultImg: {
    width: "100%",
    borderRadius: "12px",
  },

  // 🎨 PALETTE STYLES
  palette: {
    display: "flex",
    marginTop: "10px",
    gap: "6px",
  },

  colorBox: {
    width: "25px",
    height: "25px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
};

export default App;