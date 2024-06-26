import express from "express";
import dotenv from "dotenv";
import { getMapUuid } from "./services/mapService";
import path from "path";
import { IMAGE_BASE_URL, ITEM_DELIMITER, PARAM_DELIMITER } from "./const/urls";
import { logRequest } from "./middlewares/logRequest";
import { getImageFromUuid } from "./services/imageService";
import { authorizationMiddleware } from "./middlewares/authorization";
import { PlacesList } from "./types/PlacesList";
import { getRateLimiter } from "./middlewares/rateLimiter";

dotenv.config();

const app = express();
const port = process.env.port || 3000;

const rateLimit = getRateLimiter();

app.use(logRequest);

app.get(
  "/map",
  authorizationMiddleware,
  rateLimit,
  async (req: express.Request, res: express.Response) => {
    const places = req.query.places as string;
    const placesList: PlacesList = places
      ?.split(ITEM_DELIMITER)
      ?.map((list) => {
        const [name, number, color] = list.split(PARAM_DELIMITER);
        if (!name) {
          res.status(400).send("Each place must have a name");
          return;
        }
        return { name, number, color };
      })
      .filter(Boolean) as PlacesList;

    const size = req.query?.size as string;

    try {
      const uuid = await getMapUuid(placesList, size);
      if (!uuid) {
        res.status(500).send("Error generating map");
        return;
      }
      res.json({ imageUrl: `${IMAGE_BASE_URL}${uuid}` });
    } catch (error) {
      res.status(500).send("Error generating map");
    }
  }
);

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
