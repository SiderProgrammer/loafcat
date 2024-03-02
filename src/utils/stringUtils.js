export function shortenText(text, length) {
    if (text.length <= length) {
        return text;
    } else {
        return text.substring(0, 5) + "..." + text.substring(text.length - 5);
    }
}
