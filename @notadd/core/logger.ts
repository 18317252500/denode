export abstract class Logger {
  abstract log(msg: any, ...args: any[]): void;
  abstract info(msg: any, ...args: any[]): void;
  abstract warn(msg: any, ...args: any[]): void;
  abstract debug(msg: any, ...args: any[]): void;
  abstract error(msg: any, ...args: any[]): void;
  abstract verbose(msg: any, ...args: any[]): void;
}
