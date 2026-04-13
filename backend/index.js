import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// ============================
// 🔥 STYLE PROMPTS
// ============================
const STYLE_PROMPTS = {
  modern: "modern interior, clean lines, neutral colors, minimal decor",
  luxury: "luxury interior, premium materials, elegant lighting",
  minimalist: "minimalist interior, simple furniture, open space",
  indian: "traditional indian interior, wooden textures, warm tones"
};

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    // ============================
    // 🔥 GET DATA FROM FRONTEND
    // ============================
    const { style } = req.body;

    // ============================
    // 🔥 AUTO PROMPT
    // ============================
    const stylePrompt = STYLE_PROMPTS[style] || "modern interior design";

    const autoPrompt = `
    A high-quality interior redesign,
    ${stylePrompt},
    fully furnished room with aesthetic furniture,
    photorealistic, 4k, realistic lighting
    `;

    // ============================
    // 🔥 CREATE FORM DATA
    // ============================
    const form = new FormData();
    form.append("prompt", autoPrompt);
    form.append("style", style);
    form.append("image", fs.createReadStream(req.file.path));

    // ============================
    // 🔥 CALL AI (UPDATED)
    // ============================
    const response = await axios.post(
      "https://iteratively-unrespirable-elvera.ngrok-free.dev/generate",
      form,
      {
        headers: form.getHeaders(),
        timeout: 300000
      }
    );

    // ============================
    // 🔥 CLEANUP
    // ============================
    fs.unlinkSync(req.file.path);

    // ============================
    // 🔥 RETURN DATA (IMAGES + PALETTES)
    // ============================
    res.json({
      success: true,
      images: response.data.images,
      palettes: response.data.palettes
    });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Error generating design"
    });
  }
});

// ============================
// 🔥 START SERVER
// ============================
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});