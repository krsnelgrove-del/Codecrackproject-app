
// use prisma-8
import { defineContract } from '@prisma/orm-postgres/contract-builder';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const visitorCount = model('VisitorCount', {
    fields: {
      id: field.text().id().default('global'),
      count: field.int().default(0),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });

  return {
    models: {
      VisitorCount: visitorCount
    },
  };
});
