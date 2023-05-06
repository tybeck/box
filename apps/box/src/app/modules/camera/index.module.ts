import { Module } from '@nestjs/common';

import { CameraGateway } from './index.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [CameraGateway],
})
export class CameraModule {}
