/**
 * @param {string | number} str
 * @returns string
 * @description primitive type의 field를 snake 형식으로 변환
 */
export function camelToSnakeByStr(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
/**
 * @param {any} value
 * @returns {any}
 * @description 객체의 모든 key를 snake 형식으로 변환
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
 * @param {string | number} str
 * @returns string
 * @description primitive type의 field를 camelCase 형식으로 변환
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
/**
 * @param {any} obj
 * @returns {any}
 * @description 객체의 모든 key를 재귀적으로 camelCase로 변환
 */
export function SnakeToCamelByObj(obj) {
  if (Array.isArray(obj)) {
    return obj.map(SnakeToCamelByObj);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const newKey = snakeToCamel(key);
        const newValue = SnakeToCamelByObj(value);
        return [newKey, newValue];
      }),
    );
  }

  return obj;
}
