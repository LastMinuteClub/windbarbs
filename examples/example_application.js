document.addEventListener("DOMContentLoaded", () => {
    // get svg
    let barb = getWindBarb(22, 45);

    // create container and add the wind barb
    let container = document.createElement('div'); 
    container.innerHTML = barb;

    // display wind barb
    document.body.appendChild(container);
});