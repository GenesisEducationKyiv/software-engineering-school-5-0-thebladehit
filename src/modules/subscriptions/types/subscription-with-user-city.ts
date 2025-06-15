import { Prisma } from '@prisma/client';

export type SubscriptionWithUserAndCity = Prisma.SubscriptionGetPayload<{
  include: {
    user: {
      select: { email: true };
    };
    city: {
      select: { name: true };
    };
  };
}>;
