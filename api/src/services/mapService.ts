import axios from "axios";
import { mapSizeDefault, mapSizeRE, mapSizes } from "../const/mapSizes";
import { storeImage } from "../utils/imageCache";
import { PlacesList } from "../types/PlacesList";
export async function getMapUuid(
  places: PlacesList,
  size?: string
): Promise<string> {
  const markers = places
    .map(
      (place, index) =>
        `markers=color:${place.color || "blue"}|label:${
          place.number && /^\d/.test(place.number.charAt(0))
            ? place.number.charAt(0)
            : index + 1
        }|${encodeURIComponent(place.name)}`
    )
    .join("&");
  const sizeParam =
    size && mapSizeRE.test(size)
      ? size
      : mapSizes[size as keyof typeof mapSizes]
      ? mapSizes[size as keyof typeof mapSizes]
      : mapSizeDefault;
  const url = `https://maps.googleapis.com/maps/api/staticmap?${markers}&key=${process.env.GOOGLE_MAPS_API_KEY}&size=${sizeParam}`;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return storeImage(base64);
  } catch (error) {
    throw new Error("Error generating map");
  }
}
