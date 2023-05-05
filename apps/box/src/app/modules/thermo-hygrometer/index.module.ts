import { Module } from '@nestjs/common';

import { ThermoHygrometerController } from './index.controller';
import { ThermoHygrometerService } from './index.service';

@Module({
  imports: [],
  controllers: [ThermoHygrometerController],
  providers: [ThermoHygrometerService],
})
export class ThermoHygrometerModule {}
