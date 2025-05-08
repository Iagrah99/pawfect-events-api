require('dotenv').config();
const cloudinary = require('cloudinary').v2;

exports.GenerateDogImg = async () => {
  const randomDogImage = 'https://placedog.net/700x467?random';

  // console.log(cloudinary.config().cloud_name);

  try {
    const result = await cloudinary.uploader.upload(randomDogImage, {
      resource_type: 'image',
    });

    // console.log('Success', JSON.stringify(result, null, 2));

    return result.secure_url;
  } catch (err) {
    console.log('Error', JSON.stringify(err, null, 2));
    throw new Error('Could not generate default dog image');
  }
};
