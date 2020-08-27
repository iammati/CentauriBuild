// Centauri.Events.Window.OnLoad = {};

window.onload = () => {
    for(let eventCallback in Centauri.Events.Window.OnLoad) {
        Centauri.Events.Window.OnLoad[eventCallback]();
    }
};
