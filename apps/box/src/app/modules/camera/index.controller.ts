import {Controller, Get, Res} from '@nestjs/common';
import {Response} from 'express';

import {CameraService} from './index.service';

@Controller('/camera')
export class CameraController {
  constructor(
    private camera: CameraService
  ) {}

  @Get()
  async getLiveVideo(@Res() res: Response) {
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    this.camera.getVideoFeed(res);
  }
}
