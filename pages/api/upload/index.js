import formidable from "formidable";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(400).json({ message: "Method not allowed" });
  }

  const form = formidable({});

  const [fields, files] = await form.parse(request);

  const file = files.cover[0];
  const { newFilename, filepath } = file;

  // now we have the information about the image, we can send it to cloudinary

  const result = await cloudinary.v2.uploader.upload(filepath, {
    public_id: newFilename,
    folder: "nf example",
  });

  console.log("result from cloudinary: ", result);

  response.status(200).json(result);
}
