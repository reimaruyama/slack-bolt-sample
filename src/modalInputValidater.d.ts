export interface modalInputValidateResult {
    isValid: Boolean;
    responseMessage?: string;
}
export declare class ModalInputValidater {
    private _date;
    private _time;
    private isValid;
    private responseMessage;
    static readonly NotMatchTimePatternErrorMessage: string;
    static readonly PastDateErrorMessage: string;
    constructor(_date: string, _time: string);
    call(): modalInputValidateResult;
    private shoudMatchTimePattern;
    private shoudNotPastDate;
}
