import {Controller, Get, Inject} from '@nestjs/common';

import {ThermoHygrometerService} from './index.service';

@Controller('/thermo-hygrometer')
export class ThermoHygrometerController {
  constructor(
    private thermoHygrometerService: ThermoHygrometerService,
  ) {}

  @Get('/reading')
  async getReading() {
    return await this.thermoHygrometerService.getCurrentReading();
  }
}
