export interface ModalViews {
    type: "modal";
    callback_id: string;
    title: object;
    submit: object;
    close: object;
    blocks: object;
}
export declare class ModalViewsBuilder {
    static standardViews(): ModalViews;
}
