import { ModalViewsBuilder } from '../modalViewsBuilder'

describe('ModalViewsBuilder', () => {
  describe('#standardViews', () => {
    let now;
    let spiedDate;

    beforeAll(() => {
      const originalDate = Date;
      now = new originalDate('Fri Jan 24 2020 22:48:59 GMT+0900 (GMT+09:00)');

      spiedDate = jest.spyOn(global, 'Date').mockImplementation(() => {
        return now;
      });
    })

    afterAll(() => {
      spiedDate.mockRestore();
    });

    test('datepicker initialDate is set to be today', () => {
      const views = ModalViewsBuilder.standardViews();

      expect(views.blocks[0].element.initial_date).toEqual('2020-1-24');
    })
  })
})