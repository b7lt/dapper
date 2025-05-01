import { upload, download } from "thirdweb/storage";
import { client } from "./ThirdwebClient";

// https://portal.thirdweb.com/typescript/v5/storage

export async function uploadToIPFS(data) {
  try {
    const uri = await upload({
        client,
        files: [
            data,
        ],
    });
    console.log("Uploaded to IPFS with URI:", uri);
    return uri;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

export async function uploadImageToIPFS(file) {
  try {
    const uri = await upload({
        client,
        files: [file, file.name]
    });
    console.log("Uploaded image to IPFS with URI:", uri);
    return uri;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw error;
  }
}

export async function downloadFromIPFS(uri) {
  try {
    const data = await download({
        client,
        uri: uri,
    });
    return data;
  } catch (error) {
    console.error("Error downloading from IPFS:", error);
    throw error;
  }
}

export async function createPostContent(content, image = null) {
  const postData = {
    content,
    timestamp: new Date().toISOString(),
  };
  
  if (image) {
    const imageUri = await uploadImageToIPFS(image);
    postData.imageUri = imageUri;
    postData.hasImage = true;
  } else {
    postData.hasImage = false;
  }
  
  const uri = await uploadToIPFS(postData);
  
  return {
    uri,
    hasImage: postData.hasImage
  };
}

export async function createProfileContent(profileData) {
  const { username, displayName, avatarFile, bannerFile } = profileData;
  
  const avatarUri = avatarFile ? await uploadImageToIPFS(avatarFile) : "";
  const bannerUri = bannerFile ? await uploadImageToIPFS(bannerFile) : "";
  
  return {
    username,
    displayName,
    avatarUri,
    bannerUri
  };
}