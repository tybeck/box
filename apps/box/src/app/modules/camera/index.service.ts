import { Readable } from 'stream';
import { createWriteStream, WriteStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { StreamCamera, Codec } from 'pi-camera-connect';
import { Response } from 'express';

@Injectable()
export class CameraService {
  static TMP_FILE = 'box.h264';

  private isCapturingAlready: boolean = false;
  private isCapturable: boolean = false;
  private camera: StreamCamera | null;
  private stream: Readable | null;
  private writable: WriteStream | null;
  private readable: Readable | null;

  constructor() {
    this.#create();
  }

  /**
   * @method create
   * Create a new camera
   * @private
   */
  #create() {
    this.camera = new StreamCamera({
      codec: Codec.H264,
    });
    if (this.camera) {
      this.writable = createWriteStream(CameraService.TMP_FILE);
      this.stream = this.camera.createStream();
      if (this.writable && this.stream) {
        this.isCapturable = true;
      }
    }
  }

  getVideoFeed(res: Response) {
    if (!this.isCapturingAlready) {
      this.readable = new Readable();
      this.readable.pipe(this.writable);
      this.camera.startCapture();
      this.isCapturingAlready = true;
    }

    res.on('data', chunk =>
      res.write(chunk)
    );

    res.on('end', () =>
      res.end()
    );

    res.on('error', () =>
      res.end()
    );
  }
}
