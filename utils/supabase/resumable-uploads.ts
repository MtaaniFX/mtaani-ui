// Adapted from https://supabase.com/docs/guides/storage/uploads/resumable-uploads?queryGroups=language&language=js
import { createClient } from "@/utils/supabase/client";
import * as tus from 'tus-js-client';

const supaURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabase = createClient();

export type ProgressListeners = {
    onProgress?: ((bytesSent: number, bytesTotal: number) => void) | null
    onSuccess?: ((payload: tus.OnSuccessPayload) => void) | null
    onSuccessTo?: ((url: string) => void) | null
    onError?: ((error: Error | tus.DetailedError) => void) | null
};

export async function uploadFile(
    bucketName: string, 
    fileName: string, file: File | Blob, 
    progress?: ProgressListeners,
    upsert: boolean = true,
) {
    const { data: { session } } = await supabase.auth.getSession();

    return new Promise((resolve, reject) => {
        var upload = new tus.Upload(file, {
            endpoint: `${supaURL}/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                authorization: `Bearer ${session?.access_token}`,
                // optionally set upsert to true to overwrite existing files
                'x-upsert': upsert ? 'true': 'false', 
            },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
            metadata: {
                bucketName: bucketName,
                objectName: fileName,
                contentType: file.type,
                cacheControl: '3600',
            },
            chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
            onError: function (error) {
                progress?.onError?.(error);
                console.log('Failed because: ' + error);
                reject(error);
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                progress?.onProgress?.(bytesUploaded, bytesTotal);
                // var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
                // console.log(bytesUploaded, bytesTotal, percentage + '%')
            },
            onSuccess: function (payload: tus.OnSuccessPayload) {
                progress?.onSuccess?.(payload);
                progress?.onSuccessTo?.(upload.url!);
                // console.log('Download %s from %s', upload.file?.name, upload.url);
                console.log('File uploaded successfully, download from:');
                console.log(upload.url);
                resolve({});
            },
        })

        // Check if there are any previous uploads to continue.
        return upload.findPreviousUploads().then(function (previousUploads) {
            // Found previous uploads so we select the first one.
            if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0]);
            }

            // Start the upload
            upload.start();
        })
    })
}
