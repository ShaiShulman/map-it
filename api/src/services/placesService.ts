import axios from "axios";
import { PLACE_IMAGE_HEIGHT, PLACE_IMAGE_WIDTH } from "../const/imageFormats";

async function getPlaceImage(place: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=photos&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    console.log(response.data);

    const photoReference =
      response.data.candidates[0].photos[0].photo_reference;

    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${PLACE_IMAGE_WIDTH}&maxheight=${PLACE_IMAGE_HEIGHT}&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    return imageUrl;
  } catch (error) {
    console.error(`Failed to get image for place "${place}": ${error}`);
    return null;
  }
}

export async function getPlaceImages(places: string[]) {
  const imagePromises = places.map(getPlaceImage);
  const imageResults = await Promise.allSettled(imagePromises);

  const imageUrls = imageResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<string>).value);

  return imageUrls;
}
