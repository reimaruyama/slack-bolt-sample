import { advanceTo, clear } from 'jest-date-mock';
import { ModalInputValidater } from '../modalInputValidater'

describe('ModalInputValidater', () => {
  describe('#call', () => {
    beforeAll(() => {
      advanceTo(new Date('Fri Jan 24 2020 22:48:59 GMT+0900 (GMT+09:00)'));
    })

    afterAll(() => {
      clear();
    });

    describe('正常系', () => {
      test('Valid', () => {
        const validater = new ModalInputValidater('2020-1-25', '10:00')
        const result = validater.call();

        expect(result.isValid).toEqual(true);
      })
    })

    describe('過去の日時が入力された場合', () => {
      test('Invalid', () => {
        const validater = new ModalInputValidater('1990-1-20', '10:00')
        const result = validater.call();

        expect(result.isValid).toEqual(false);
        expect(result.responseMessage).toContain(ModalInputValidater.PastDateErrorMessage);
      })
    })

    describe('時刻が規定の正規表現に一致しなかった場合', () => {
      test('Invalid', () => {
        const validater = new ModalInputValidater('2020-1-25', '10-00')
        const result = validater.call();

        expect(result.isValid).toEqual(false);
        expect(result.responseMessage).toContain(ModalInputValidater.NotMatchTimePatternErrorMessage);
      })
    })
  })
})