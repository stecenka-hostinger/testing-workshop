export interface KeyValueMap extends Record<string, any> {
  default: any;
}

export const mapKeyValue = (keyValueMap: KeyValueMap, key: string | number) => {
  if (!keyValueMap[key]) {
    return keyValueMap.default;
  }

  return keyValueMap[key];
};
