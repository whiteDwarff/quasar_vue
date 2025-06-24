/**
 * 이메일 유효성 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validEmail(value) {
  const reg =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return reg.test(value);
}
/**
 * 전화번호 유효성 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validTel(value) {
  const reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return reg.test(value);
}
/**
 * 비밀번호 유효성 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validPassword(value) {
  const reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  return reg.test(value);
}
/**
 * 입력값이 한글로만 구성되어 있는지 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validOnlyKR(value) {
  const reg = /^[가-힣\s]+$/;
  return reg.test(value);
}
/**
 * 영어 알파벳으로만 구성되어 있는지 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validOnlyEN(value) {
  const reg = /^[a-zA-Z\s]+$/;
  return reg.test(value);
}
/**
 * 날짜 형식(YYYY-MM-DD)이 맞는지 검사
 * @param {string} value - 날짜형식
 * @returns {boolean}    - 참/거짓
 */
export function validDate(value) {
  const reg = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return reg.test(value);
}
/**
 * 이미지 형식의 파일을 등록 시 미리보기 지원
 * @param {Event} target   - 파일 input 이벤트 객체
 * @returns {null | Object} - 미리보기용 파일 객체 혹은 null
 */
export function imageRender(target) {
  if (target.files.length) {
    const file = target.files[0];

    const ext = file.name.split('.').pop().toLowerCase();
    const extArr = ['png', 'jpg', 'jpeg'];

    if (!extArr.includes(ext)) {
      target.value = '';
      $showAlert(`[${extArr.join(', ')}] 확장자만 등록할 수 있습니다.`);
      return null;
    }

    return {
      src: URL.createObjectURL(file),
      file,
    };
  }
  return null;
}
/**
 * 파일명에서 확장자를 추출하여 등록가능한 파일인지 확인
 * @param {file} file  - 등록된 파일
 * @param {array} exts - 등록가능한 파일목록
 * @returns {boolean}
 */
export function validFileExt(file, exts) {
  if (!file || !exts || !exts.length) return false;

  const fileName = file.name;
  const dotIndex = fileName.lastIndexOf('.');
  const ext = dotIndex !== -1 ? fileName.slice(dotIndex).toLowerCase() : '';

  return exts.map((ext) => ext.toLowerCase()).includes(ext) ? true : false;
}
