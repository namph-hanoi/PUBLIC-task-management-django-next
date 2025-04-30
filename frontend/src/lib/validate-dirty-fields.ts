import { ZodObject } from 'zod';

export function validateDirtyFields<T extends ZodObject<any>>(
  schema: T,
  data: any,
  dirtyFields: any
) {
  const dirtyKeys = Object.keys(dirtyFields);
  const dirtyData = dirtyKeys.reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {} as any);
  const partialSchema = schema.pick(
    dirtyKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  return partialSchema.safeParse(dirtyData);
}