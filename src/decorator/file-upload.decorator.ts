import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadOptions {
  key: string;
  path: string;
  filename?: string;
}

export function FileUpload(options: FileUploadOptions) {
  const { key, path: destinationPath, filename = uuidv4() } = options;

  return applyDecorators(
    UseInterceptors(
      FileInterceptor(key, {
        storage: diskStorage({
          destination: destinationPath,
          filename: (req, file, cb) => {
            if (!file || !file.originalname) {
              return cb(new Error('File does not have an original name'), null);
            }

            const ext = path.extname(file.originalname);

            const uniqueName = `${filename}-${uuidv4()}${ext}`;
            cb(null, uniqueName);
          },
        }),
      }),
    ),
  );
}
