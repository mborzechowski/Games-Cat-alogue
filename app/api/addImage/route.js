import cloudinary from '@/config/cloudinary'

export async function POST(req) {

    try {
        const fileStr = req.body.data;

        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'ml_default',
        });

        res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }
}

