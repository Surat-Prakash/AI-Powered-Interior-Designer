import { useState } from "react";

function MaskCanvas({ image, setMask }) {
  const [maskImage, setMaskImage] = useState(null);

  const handleMaskUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMask(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setMaskImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imagesRow}>
        <div style={styles.imageBox}>
          <h4 style={styles.imageLabel}>Base Image</h4>
          <img src={image} alt="base" style={styles.image} />
        </div>

        {maskImage && (
          <div style={styles.imageBox}>
            <h4 style={styles.imageLabel}>Uploaded Mask</h4>
            <img src={maskImage} alt="mask" style={styles.image} />
          </div>
        )}
      </div>

      <div style={styles.uploadSection}>
        <label style={styles.uploadLabel}>
          <strong>Upload Mask Image:</strong>
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleMaskUpload}
          style={styles.fileInput}
        />
      </div>

      {maskImage && (
        <p style={styles.successMessage}>✓ Mask uploaded</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    height: "100%",
  },

  imagesRow: {
    display: "flex",
    gap: "12px",
    overflow: "auto",
    flex: 1,
  },

  imageBox: {
    flex: 1,
    minWidth: "120px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  imageLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    opacity: 0.6,
    margin: "0",
  },

  image: {
    width: "100%",
    height: "auto",
    maxHeight: "180px",
    borderRadius: "6px",
    objectFit: "cover",
    border: "1px solid #2a2a2e",
  },

  uploadSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  uploadLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    opacity: 0.6,
  },

  fileInput: {
    padding: "8px",
    border: "1px solid #2a2a2e",
    borderRadius: "4px",
    backgroundColor: "#1a1a1d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },

  successMessage: {
    margin: "0",
    fontSize: "12px",
    color: "#4CAF50",
  },
};

export default MaskCanvas;