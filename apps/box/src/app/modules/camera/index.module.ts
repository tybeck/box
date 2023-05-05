import { Module } from '@nestjs/common';

import { CameraController } from './index.controller';
import { CameraService } from './index.service';

@Module({
  imports: [],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
