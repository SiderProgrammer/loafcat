export class Async {
    // TODO : change setimeout to phaser timer
    static async delay(duration) {
        this.resolve = null;
        return new Promise((resolve) => {
            this.resolve = resolve;
            setTimeout(resolve, duration);
        });
    }

    static break() {
        this.resolve();
    }
}
