import express from "express";
import dotenv from "dotenv";
import { getMapUuid } from "./services/mapService";
import path from "path";
import { getImage } from "./utils/imageCache";
import { IMAGE_BASE_URL, LIST_SEPERATOR } from "./const/urls";
import { logRequest } from "./middlewares/logRequest";
import { getImageFromUuid } from "./services/imageService";
import { authorizationMiddleware } from "./middlewares/authorization";

dotenv.config();

const app = express();
const port = 3000;

app.use(logRequest);

app.get("/map", authorizationMiddleware, async (req, res) => {
  const places = req.query.places as string;
  const placeList = places.split(LIST_SEPERATOR);
  const size = req.query?.size as string;

  try {
    const uuid = await getMapUuid(placeList, size);
    if (!uuid) {
      res.status(500).send("Error generating map");
      return;
    }
    res.json({ imageUrl: `${IMAGE_BASE_URL}${uuid}` });
  } catch (error) {
    res.status(500).send("Error generating map");
  }
});

app.get("/image", async (req, res) => {
  const uuid = req.query.uuid as string;

  try {
    if (!uuid) {
      res.status(404).send("Image not found");
      return;
    }
    let base64Image = await getImageFromUuid(uuid);
    if (!base64Image) {
      res.status(404).send("Image not found");
      return;
    }

    const imageBuffer = Buffer.from(base64Image, "base64");

    res.set({
      "Content-Type": "image/png",
      "Content-Length": imageBuffer.length,
    });
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).send("Error generating image");
  }
});

app.get("/legal", (req, res) => {
  res.sendFile(path.join(process.cwd(), "assets/privacy.md"), {
    headers: { "Content-Type": "text/markdown" },
  });
});

app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.sendFile(path.join(process.cwd(), "assets/ai-plugin.json"), {
    headers: { "Content-Type": "application/json" },
  });
});

app.get(["/", "/.well-known/openai.yaml"], (req, res) => {
  res.sendFile(path.join(process.cwd(), "assets/openai.yaml"), {
    headers: { "Content-Type": "application/json" },
  });
});

app.get("/logo", (req, res) => {
  res.sendFile(path.join(process.cwd(), "assets/logo.png"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
