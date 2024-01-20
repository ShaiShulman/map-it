import { v4 as uuidv4 } from "uuid";
import NodeCache from "node-cache";
const imageCache = new NodeCache();

export const storeImage = (base64Image: string): string => {
  const uuid = uuidv4();
  imageCache.set(uuid, base64Image);
  return uuid;
};

export const getImage = (uuid: string): string | undefined => {
  return imageCache.get(uuid);
};
