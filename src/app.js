export function render(oldRender) {
    if (localStorage.getItem('debug') === 'false') {
        console.clear();
        console.log = console.warn = console.error = () => {};
    }
    oldRender();
}

export function onRouteChange({ location, routes }) {}
