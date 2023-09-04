import { SetMetadata } from '@nestjs/common';

export const Active = () => {
  return SetMetadata('isActive', true);
};