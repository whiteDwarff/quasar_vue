/**
 * primitive type의 field를 snake 형식으로 변환
 * @param {string | number} str
 * @returns string
 */
export function camelToSnakeByStr(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
/**
 * 객체의 모든 key를 snake 형식으로 변환
 * @param {any} value
 * @returns {any}
 */
export function camelToSnakeByObj(obj) {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnakeByObj);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const newKey = camelToSnakeByStr(key);
        const newValue = camelToSnakeByObj(value);
        return [newKey, newValue];
      }),
    );
  }

  return obj;
}

/**
 * primitive type의 field를 camelCase 형식으로 변환
 * @param {string | number} str
 * @returns string
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
/**
 * 객체의 모든 key를 재귀적으로 camelCase로 변환
 * @param {any} obj
 * @returns {any}
 */
export function snakeToCamelByObj(obj) {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelByObj);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const newKey = snakeToCamel(key);
        const newValue = snakeToCamelByObj(value);
        return [newKey, newValue];
      }),
    );
  }

  return obj;
}
