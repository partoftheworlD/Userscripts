// ==UserScript==
// @name        MyAnimeList on amd.online
// @namespace   Tampermonkey Scripts
// @icon        https://amd.online/templates/Animedia1/images/favicon.svg
// @version     1.0.0
//
// @match       https://amd.online/*.html
// @grant       none
//
// @author      partoftheworlD
// @description
// ==/UserScript==

// Функция для показа уведомления
function showNotification(message, duration = 2000) {
    // Удаляем предыдущее уведомление, если оно есть
    const old = document.getElementById('mal-copy-notification');
    if (old) old.remove();

    const popup = document.createElement('div');
    popup.id = 'mal-copy-notification';
    popup.textContent = message;
    Object.assign(popup.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        zIndex: '100000',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    document.body.appendChild(popup);

    // Плавное появление
    requestAnimationFrame(() => {
        popup.style.opacity = '1';
    });

    // Автоисчезновение
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    }, duration);
}

function smartTrim(text, maxLength = 100) {
    if (text.length <= maxLength) return text;

    const lastSpace = text.slice(0, maxLength).lastIndexOf(' ');
    const cutIndex = lastSpace > 0 ? lastSpace : maxLength;

    return text.slice(0, cutIndex);
}

function getData() {
    const SELECTORS = {
        localTitle: "#dle-content div.amd-title > h1",
        ogTitle: "#dle-content div.amd-sub-container > span",
    };
    const localTitle = document.querySelector(SELECTORS.localTitle)?.textContent || "";
    const ogTitle = document.querySelector(SELECTORS.ogTitle)?.textContent || "";

    const anime_name = smartTrim(ogTitle.trim());
    const malUrl = `https://myanimelist.net/anime.php?q=${encodeURIComponent(anime_name)}&cat=anime`;

    const match = localTitle.match(/«([^»]+)»/);
    let title = match ? match[1] : localTitle;
    title = smartTrim(title.trim());

    const markdownLinks = `[${title}](${window.location.href})\n[${ogTitle}](${malUrl})`;

    return {
        markdownLinks,
        malUrl
    };
}

function createButton({
    text,
    top,
    color,
    hoverColor,
    onClick
}) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = "button-amd-mal";
    Object.assign(button.style, {
        position: 'fixed',
        top: top,
        right: '10px',
        width: '160px',
        zIndex: '99999',

        // Размеры и отступы
        padding: '12px 24px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',

        // Цвета и рамка
        backgroundColor: color,
        color: 'white',

        // Эффекты
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
    });

    button.onclick = onClick;
    button.onmouseenter = () => button.style.background = hoverColor;
    button.onmouseleave = () => button.style.background = color;

    document.body.appendChild(button);
}

(function() {
    'use strict';

    let data = getData();

    createButton({
        text: 'Скопировать ссылки',
        top: '70px',
        color: '#4CAF50',
        hoverColor: '#459f48',
        onClick: () => {
            navigator.clipboard.writeText(data.markdownLinks);
            showNotification("✨Скопировано в буфер обмена!");
        }
    });

    createButton({
        text: 'Найти на MAL',
        top: '120px',
        color: '#C50725',
        hoverColor: '#B50725',
        onClick: () => window.open(data.malUrl, '_blank')
    });
})();