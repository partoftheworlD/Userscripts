// ==UserScript==
// @name         Restart button
// @namespace    http://tampermonkey.net/
// @version      2026-07-06
// @description  try to take over the world!
// @author       partoftheworlD
// @match        http://192.168.1.1/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tp-link.com
// @grant        none
// ==/UserScript==

function createRebootButton() {
    const container = document.querySelector('#pppoe_conn_btn_container > div:nth-child(2)');
    const button_box = container.cloneNode(true);
    const button = button_box.querySelector('button');

    button.className = "button-button part-seperate gap enabled"
    button.textContent = "Перезагрузка";
    button.removeAttribute('disabled');
    button.id = "reboot_btn";
    button.style = "margin-left: 10px";

    button.onclick = () => { $("#pppoe_conn_btn").click() };

    container.appendChild(button_box);
}

(function () {
    'use strict';

    const observerOptions = {
        childList: true,
        subtree: true,
    };

    const observer = new MutationObserver(() => {
        if (document.querySelector("#pppoe_conn_btn")) {
            createRebootButton();
            observer.disconnect();
        }
    });

    observer.observe(document.body, observerOptions);

})();