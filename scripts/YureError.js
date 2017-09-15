export default class YureError extends Error{
  constructor(message){
    super(message);
    this.name = 'YureError';
  }
}