import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  public async uploadArquivo(file: any, id: string) {
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_S3_BUCKET;
    const s3 = new S3({
      region: region,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${id}.${fileExtension}`;

    this.logger.log(` URL KEY: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: bucket,
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return `https://${bucket}.s3.${region}.amazonaws.com/${urlKey}`;
        },
        (err) => {
          this.logger.log(err);
          return err;
        },
      );

    return data;
  }
}
