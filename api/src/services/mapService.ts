import axios from "axios";
import { mapSizeDefault, mapSizeRE, mapSizes } from "../const/mapSizes";
import { storeImage } from "../utils/imageCache";

export async function getMapUuid(
  places: string[],
  size?: string
): Promise<string> {
  const markers = places
    .map(
      (place, index) =>
        `markers=color:blue|label:${index + 1}|${encodeURIComponent(place)}`
    )
    .join("&");
  const sizeParam =
    size && mapSizeRE.test(size)
      ? size
      : mapSizes[size as keyof typeof mapSizes]
      ? mapSizes[size as keyof typeof mapSizes]
      : mapSizeDefault;
  const url = `https://maps.googleapis.com/maps/api/staticmap?${markers}&key=${process.env.GOOGLE_MAPS_API_KEY}&size=${sizeParam}`;
  console.log(url);

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return storeImage(base64);
  } catch (error) {
    throw new Error("Error generating map");
  }
}
