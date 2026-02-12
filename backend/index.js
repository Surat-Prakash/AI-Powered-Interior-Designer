import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/generate", upload.fields([
  { name: "image" },
  { name: "mask" }
]), async (req, res) => {
  try {
    const form = new FormData();

    form.append("prompt", req.body.prompt);
    form.append("image", fs.createReadStream(req.files.image[0].path));
    form.append("mask", fs.createReadStream(req.files.mask[0].path));

    const response = await axios.post(
      "https://iteratively-unrespirable-elvera.ngrok-free.dev/generate", 
      form,
      {
        headers: form.getHeaders(),
        responseType: "arraybuffer"
      }
    );

    res.set("Content-Type", "image/png");
    res.send(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
