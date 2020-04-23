let isDev: boolean = false;
export function isDevMode() {
    return isDev;
}
export function setDevMode(dev: boolean) {
    isDev = dev;
}
