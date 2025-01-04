import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequiredValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || value.toString().trim() === '') {
      throw new BadRequestException(
        `Please provide a value for the "${metadata.data}" field, as it is required.`
      );
    }

    return value;
  }
}
