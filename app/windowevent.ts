export function emitEvent(eventName: string) {
    let evt;

    try {
        evt = new CustomEvent(eventName);
    } catch (e) {
        // deprecated approach
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, true);
    }

    if (evt) {
        window.dispatchEvent(evt);
    }
}