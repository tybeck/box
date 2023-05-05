import { Module } from '@nestjs/common';

import { CameraModule } from '@box/modules/camera';
import { ThermoHygrometerModule } from '@box/modules/thermo-hygrometer';

@Module({
  imports: [
    CameraModule,
    ThermoHygrometerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
