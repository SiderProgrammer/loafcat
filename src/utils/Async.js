export class Async {
  // TODO : change setimeout to phaser timer
  static async delay(duration) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }
}
