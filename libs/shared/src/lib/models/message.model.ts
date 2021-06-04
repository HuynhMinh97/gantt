export class MessageModel {
  code: string;
  params: any[];
  messageFull: string;
  message: string;

  constructor(code: string, params?: any[]) {
    this.code = code;
    this.params = params;
  }
}
