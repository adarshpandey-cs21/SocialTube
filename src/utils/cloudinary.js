import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY,  
  api_secret:process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null;
    //upload file on cloudinary
    const result = await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto",
    });
    //file has been uploaded successfully
    // console.log("File uploaded successfully on cloudinary", result.url);
    fs.unlinkSync(localFilePath); //delete file from local directory
    return result;

  } catch (error) {
    fs.unlinkSync(localFilePath); //delete file from local directory
    console.error(error);
    return null;
  }
};

export {uploadOnCloudinary};