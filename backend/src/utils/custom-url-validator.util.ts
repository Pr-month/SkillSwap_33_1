import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isURL,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/types';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsUrlWithConfig implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}

  validate(value: string): boolean {
    const appConfig = this.configService.get<AppConfig>('APP_CONFIG');

    if (appConfig?.environment === 'development') {
      const localhostPattern =
        /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i;
      // if dev environment and localhost server, return true, otherwise check for valid url
      if (localhostPattern.test(value)) {
        return true;
      }
    }

    return isURL(value);
  }

  defaultMessage(): string {
    return 'URL is invalid';
  }
}

export function IsValidUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUrlWithConfig,
    });
  };
}
