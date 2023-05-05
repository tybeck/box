import { Injectable } from '@nestjs/common';
import i2c, { I2CBus } from 'i2c-bus';

@Injectable()
export class ThermoHygrometerService {
  /**
   * @property TIMEOUT
   * The amount of timeout to wait before reading the sensor (in ms).
   */
  static TIMEOUT = 100;
  /**
   * @property ADDRESS
   * This is the address that our DHT20 sensor has been given; this
   * could be different depending on the manufacturer.
   * @static
   */
  static ADDRESS = 0x38;
  /**
   * @property CMD_START
   * This is the command we need to send to our sensor to tell it
   * we want to be given a measurement.
   * @static
   */
  static CMD_START = 0xAC;
  /**
   * @property CMD_READ
   * This commands tells our sensor we now want to read the measurement.
   * @static
   */
  static CMD_READ = 0x00;
  /**
   * @property CMD_MODE
   * Measurement type; in our case we just want normal measurements.
   * @static
   */
  static CMD_MODE = 0x08;
  /**
   * @property ALLOC_SIZE
   * The allocated size necessary for the operation we're about to perform.
   */
  static ALLOC_SIZE = 6;
  /**
   * @property BUS
   * Which bus on our microcontroller to interact with.
   */
  static BUS = 1;

  bus: I2CBus | null;

  constructor() {
    this.bus = i2c.open(ThermoHygrometerService.BUS, this.#noop);
  }

  /**
   * @method noop
   * This is primarily to get past the need to have a function signature
   * provided to `i2c` open method, we don't care if it's available since
   * if it's not available we'll ignore it.
   * @private
   */
  #noop = () => {}

  /**
   * @method getMeasurement
   * Ask and retrieve a measurement from the bus connected to DHT sensor.
   * @private
   */
  async #getMeasurement(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from([ThermoHygrometerService.CMD_MODE]);
      this.bus.writeI2cBlock(
        ThermoHygrometerService.ADDRESS,
        ThermoHygrometerService.CMD_START,
        1,
        buffer,
        (writeError) => {
          if (writeError) {
            return reject(writeError);
          }
          setTimeout(() => {
            const data = Buffer.alloc(ThermoHygrometerService.ALLOC_SIZE);
            this.bus.readI2cBlock(
              ThermoHygrometerService.ADDRESS,
              ThermoHygrometerService.CMD_READ,
              ThermoHygrometerService.ALLOC_SIZE,
              data,
              (readError) => {
                if (readError) {
                  return reject(readError);
                }
                return resolve(data);
              }
            )
          }, ThermoHygrometerService.TIMEOUT);
        }
      );
    });
  }

  /**
   * @method getCurrentReading
   * Get a reading that has just been measured
   */
  async getCurrentReading() {
    if (this.bus) {
      try {
        const data = await this.#getMeasurement();
        console.log('data', data);
        if (data) {
          const humidity = ((data[1] << 12) | (data[2] << 4) | (data[3] >> 4)) / 1048576.0 * 100.0;
          const celsius = ((data[3] & 0x0F) << 16 | data[4] << 8 | data[5]) / 1048576.0 * 200.0 - 50.0;
          const temperature = celsius * 9 / 5 + 32;
          console.log(humidity, celsius, temperature);
          return {
            humidity,
            temperature,
          };
        }
      } catch(e) {
        return {
          humidity: 0,
          temperature: 0,
        }
      }
    }
  }
}
