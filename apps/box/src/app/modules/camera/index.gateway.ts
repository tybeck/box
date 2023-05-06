import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

@WebSocketGateway()
export class CameraGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  process: ChildProcessWithoutNullStreams | null;

  #stream() {
    this.process = spawn('ffmpeg', [
      '-rtsp_transport', 'tcp',
      '-i', 'rtsp://localhost:8554/stream',
      '-c', 'copy',
      '-f', 'mp4',
      '-movflags', 'frag_keyframe+empty_moov',
      'pipe:1',
    ]);

    if (this.process) {
      this.process.stdout.on('data', (data) => {
        this.server.emit('video-chunk', data);
      });
    }
  }

  afterInit() {
    this.#stream();
  }
}

// import { Readable } from 'stream';
// import { createWriteStream, WriteStream } from 'fs';
// import { Injectable } from '@nestjs/common';
// import { StreamCamera, Codec } from 'pi-camera-connect';
// import { Response } from 'express';
//
// @Injectable()
// export class CameraService {
//   static TMP_FILE = 'box.h264';
//
//   private isCapturingAlready: boolean = false;
//   private isCapturable: boolean = false;
//   private camera: StreamCamera | null;
//   private stream: Readable | null;
//   private writable: WriteStream | null;
//
//   constructor() {
//     this.#create();
//   }
//
//   /**
//    * @method create
//    * Create a new camera
//    * @private
//    */
//   #create() {
//     this.camera = new StreamCamera({
//       codec: Codec.H264,
//     });
//     if (this.camera) {
//       this.writable = createWriteStream(CameraService.TMP_FILE);
//       this.stream = this.camera.createStream();
//       if (this.writable && this.stream) {
//         this.isCapturable = true;
//       }
//     }
//   }
//
//   getVideoFeed(res: Response) {
//     if (!this.isCapturingAlready) {
//       this.camera.startCapture();
//       this.isCapturingAlready = true;
//     }
//
//     this.stream.on('data', chunk => {
//       console.log('chunky', chunk);
//       res.write(chunk);
//     });
//     this.stream.on('end', _ => res.end());
//   }
// }
