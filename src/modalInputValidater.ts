export interface modalInputValidateResult {
  isValid: Boolean,
  responseMessage?: string,
}

export class ModalInputValidater {
  private isValid: Boolean;
  private responseMessage: string[];
  static readonly NotMatchTimePatternErrorMessage: string = '時刻には00:00~23:59までの値を入力してね'
  static readonly PastDateErrorMessage: string = 'リマインダーには未来の日時を設定してね'


  constructor(private _date: string, private _time: string) {
    this.responseMessage = [];
  }

  public call(): modalInputValidateResult {
    const responseMessageTop: string = '追加できなかった :sweat_drops:'
    this.shoudMatchTimePattern();
    this.shoudNotPastDate();

    if (this.isValid === false) {
      this.responseMessage.unshift(responseMessageTop);

      return {
        isValid: this.isValid,
        responseMessage: this.responseMessage.join('\n')
      }
    }

    return {isValid: true}
  }

  private shoudMatchTimePattern(): void {
    const timePattern: RegExp = /([0-1][0-9]|2[0-3]):[0-5][0-9]/

    // バリデーション 時刻が正規表現にマッチするか確認
    if (!timePattern.test(this._time)) {
      this.isValid = false;
      this.responseMessage.push(ModalInputValidater.NotMatchTimePatternErrorMessage)
      console.info(`Invalid time pattern: ${this._time}`)
    };
  }

  private shoudNotPastDate(): void {
    const reminderTime = new Date(`${this._date} ${this._time}`)

    if (reminderTime < new Date()) {
      this.isValid = false;
      this.responseMessage.push(ModalInputValidater.PastDateErrorMessage);
      console.info(`Not future date: ${reminderTime}`);
    };
  }
}
