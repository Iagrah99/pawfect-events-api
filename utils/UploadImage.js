require('dotenv').config();
const cloudinary = require('cloudinary').v2;

exports.UploadImage = async (imageFile) => {
  // console.log(cloudinary.config().cloud_name);

  try {
    const result = await cloudinary.uploader.upload(imageFile, {
      resource_type: 'image',
    });

    // console.log('Success', JSON.stringify(result, null, 2));

    return result.secure_url;
  } catch (err) {
    console.log('Error', JSON.stringify(err, null, 2));
    throw new Error('Could not generate default dog image');
  }
};
