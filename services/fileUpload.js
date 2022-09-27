/*
import aws from "aws-sdk";
import multer from 'multer';
import multerS3 from 'multer-s3';
const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: "eu-central-1",
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only PDF, JPEG and PNG is allowed!"), false);
    }
};
console.log(process.env.S3_BUCKET_NAME);

export const upload = multer({
    fileFilter,
    storage: multerS3({
      acl: "public-read",
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: "TESTING_METADATA" });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
    }),
});
*/

import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
console.log(process.env);
console.log(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

aws.config.update({
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyId: AWS_ACCESS_KEY_ID,
  region: AWS_REGION,
});

const s3 = new S3Client();

const fileFilter = (req, file, cb) => {
  const [, fileType] = file.mimetype.split("/");
  fileType.match(/^(png|jpeg|jpg|pdf)$/gi)
    ? cb(null, true)
    : cb(
        new Error("Invalid file type, only JPEG, PNG or PDF are allowed!"),
        false
      );
};

const storage = multerS3({
  s3: s3,
  bucket: "sciconnect-documents",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  contentLength: 5000000000,
  acl: "public-read",
  metadata: (req, file, cb) => {
    console.log(file)
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const fileName = Date.now().toString();
    cb(null, `${fileName}.${extension}`);
  },
});

export const upload = multer({
  fileFilter,
  storage,
});
