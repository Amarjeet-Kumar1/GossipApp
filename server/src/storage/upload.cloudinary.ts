import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

export const uploadFile = async ({ file }: { file: string }) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "GossipApp",
      resource_type: "auto",
    })

    return result.secure_url
  } catch (err) {
    console.log("upload", err)
    throw new Error(err)
  }
}
