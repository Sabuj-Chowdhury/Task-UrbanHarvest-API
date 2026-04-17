// this function will return from the object the choose value / required value from object

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Partial<T> => {
  //   console.log({ obj, keys });

  const pickedValues: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      pickedValues[key] = obj[key];
    }
  }
  //   console.log(pickedValues);
  return pickedValues;
};
