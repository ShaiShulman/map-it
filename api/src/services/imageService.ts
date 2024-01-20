import { getImage } from "../utils/imageCache";

export const getImageFromUuid = async (
  uuid: string
): Promise<string | undefined> => {
  let base64Image = await getImage(uuid);
  if (!base64Image) return;

  const base64Prefix = "data:image/png;base64,";
  if (base64Image.startsWith(base64Prefix)) {
    base64Image = base64Image.slice(base64Prefix.length);
  }
  return base64Image;
};
