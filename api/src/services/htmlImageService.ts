import nodeHtmlToImage from "node-html-to-image";
import { storeImage } from "../utils/imageCache";

export async function generateImageFromHtml(html: string) {
  const image = await nodeHtmlToImage({
    html: html,
    quality: 100,
    type: "png",
    puppeteerArgs: { args: ["--no-sandbox"] },
  });

  const base64 =
    typeof image == "string"
      ? Buffer.from(image, "binary").toString("base64")
      : image.toString("base64");
  return storeImage(base64);
}
