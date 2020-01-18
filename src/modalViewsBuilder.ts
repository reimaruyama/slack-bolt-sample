export interface ModalViews {
  type: "modal",
  callback_id: string,
  title: object,
  submit: object,
  close: object,
  blocks: object
};


export class ModalViewsBuilder {
  //TODO: 他のユーザーにも通知できるようにする
  //TODO: multi_users_select でできそう
  static standardViews():ModalViews {
    const date: Date = new Date()
    const initialDate: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    return {
      "type": "modal",
      "callback_id": "view_1",
      "title": {
        "type": "plain_text",
        "text": "リマインダー",
        "emoji": true
      },
      "submit": {
        "type": "plain_text",
        "text": "追加",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "キャンセル",
        "emoji": true
      },
      "blocks": [
        {
          "type": "input",
          block_id: "date",
          "element": {
            "type": "datepicker",
            action_id: "date",
            "initial_date": initialDate,
            "placeholder": {
              "type": "plain_text",
              "text": "Select a date",
              "emoji": true
            }
          },
          "label": {
            "type": "plain_text",
            "text": "日付を選んでね",
            "emoji": true
          }
        },
        {
          "type": "input",
          block_id: "time",
          "element": {
            "type": "plain_text_input",
            action_id: "time"
          },
          "label": {
            "type": "plain_text",
            "text": "時間を入力してね",
            "emoji": true
          }
        },
        {
          "type": "input",
          block_id: "text",
          "element": {
            "type": "plain_text_input",
            "multiline": true,
            action_id: "text"
          },
          "label": {
            "type": "plain_text",
            "text": "リマインドする内容を入力してね",
            "emoji": true
          }
        }
      ]
    }
  }
}



