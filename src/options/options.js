// src/options/options.js

document.addEventListener('DOMContentLoaded', function() {
    const closeAfterInput = document.getElementById('closeAfter');
    const closeAfterValue = document.getElementById('closeAfterValue');

    // Load the current setting and update the range input
    chrome.storage.sync.get(['TimeTabTerminator_closeAfter'], function(result) {
        closeAfterInput.value = result.TimeTabTerminator_closeAfter || 5;
        closeAfterValue.textContent = result.TimeTabTerminator_closeAfter || 5;
    });

    // Save the setting whenever it changes
    closeAfterInput.addEventListener('input', function() {
        const value = this.value;
        closeAfterValue.textContent = value;
        chrome.storage.sync.set({ 'TimeTabTerminator_closeAfter': parseInt(value, 10) }, function() {
            console.log('Settings updated to ' + value + ' minutes.');
        });
    });

    const intervalInput = document.getElementById('checkInterval');
    const intervalValue = document.getElementById('intervalValue');

    // Load the current setting and update the range input
    chrome.storage.sync.get(['TimeTabTerminator_checkInterval'], function(result) {
        intervalInput.value = result.TimeTabTerminator_checkInterval || 5;
        intervalValue.textContent = result.TimeTabTerminator_checkInterval || 5;
    });

    // Save the setting whenever it changes
    intervalInput.addEventListener('input', function() {
        const value = this.value;
        intervalValue.textContent = value;
        chrome.storage.sync.set({ 'TimeTabTerminator_checkInterval': parseInt(value, 10) }, function() {
            console.log('Check interval updated to ' + value + ' minutes.');
        });
    });

});
