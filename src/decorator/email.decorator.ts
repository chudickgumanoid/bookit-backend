import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsEmailFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isEmailFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/.test(value);
        },
      },
    });
  };
}
