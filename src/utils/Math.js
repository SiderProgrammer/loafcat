export class MathUtils {
  static chance(_chance) {
    if (Math.floor(Math.random() * 100) > _chance) return true;
    return false;
  }
}
