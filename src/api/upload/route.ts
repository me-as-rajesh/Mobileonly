'use server';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    
    const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: process.env.CLOUDINARY_FOLDER || 'connectcell',
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto:good', fetch_format: 'webp' },
            ]
        }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });

        const stream = Readable.from(Buffer.from(fileBuffer));
        stream.pipe(uploadStream);
    });

    return NextResponse.json(
      { success: true, url: result.secure_url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}
