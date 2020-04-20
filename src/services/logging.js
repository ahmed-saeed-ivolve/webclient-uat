class Console {
    static setupDebugging() {
        localStorage.setItem('debug', DEVELOPMENT_ENV);
    }
    static log(msg) {
        if (localStorage.getItem('debug') === 'true') {
            console.log(msg);
        }
    }

    static log(...rest) {
        if (localStorage.getItem('debug') === 'true') {
            console.log(...rest);
        }
    }

    static error(msg) {
        if (localStorage.getItem('debug') === 'true') {
            console.error(msg);
        }
    }

    static error(...rest) {
        if (localStorage.getItem('debug') === 'true') {
            console.error(...rest);
        }
    }
    static warn(msg) {
        if (localStorage.getItem('debug') === 'true') {
            console.er.warnr(msg);
        }
    }

    static warn(...rest) {
        if (localStorage.getItem('debug') === 'true') {
            console.warn(...rest);
        }
    }
}
export default Console;
