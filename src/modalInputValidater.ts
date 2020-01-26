/**
 * モーダル入力の検証結果
 */
export interface ModalInputValidateResult {
  isValid: Boolean,
  responseMessage?: string,
}

/**
 * モーダルからの入力を検証するクラス
 */
export class ModalInputValidater {
  /**
   * 現在の検証結果を保持する
   */
  private isValid: Boolean;

  /**
   * ユーザーへ返答すべきメッセージを保持する
   */
  private responseMessage: string[];

  static readonly NotMatchTimePatternErrorMessage: string = '時刻には00:00~23:59までの値を入力してね'
  static readonly PastDateErrorMessage: string = 'リマインダーには未来の日時を設定してね'


  constructor(private _date: string, private _time: string) {
    this.responseMessage = [];
  }

  /**
   * Do validate
   *
   * @return ModalInputValidateResult
   */
  public call(): ModalInputValidateResult {
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

  /**
   * 時刻の正規表現に一致するか検証します
   */
  private shoudMatchTimePattern(): void {
    const timePattern: RegExp = /([0-1][0-9]|2[0-3]):[0-5][0-9]/

    if (!timePattern.test(this._time)) {
      this.isValid = false;
      this.responseMessage.push(ModalInputValidater.NotMatchTimePatternErrorMessage)
      console.info(`Invalid time pattern: ${this._time}`)
    };
  }

  /**
   * 未来の時刻であるかどうか検証します
   */
  private shoudNotPastDate(): void {
    const reminderTime = new Date(`${this._date} ${this._time}`)

    if (reminderTime < new Date()) {
      this.isValid = false;
      this.responseMessage.push(ModalInputValidater.PastDateErrorMessage);
      console.info(`Not future date: ${reminderTime}`);
    };
  }
}
