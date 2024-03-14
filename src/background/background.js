
(function initializeExtension() {
    console.log("initialized at", Date.now().toLocaleString());
    // Check if the 'closeAfter' setting exists, set default if not
    chrome.storage.sync.get(['TimeTabTerminator_closeAfter', 'TimeTabTerminator_checkInterval'],
        function(result) {
            if (result.TimeTabTerminator_closeAfter === undefined) {
                chrome.storage.sync.set({TimeTabTerminator_closeAfter: 5});
            }
            if (result.TimeTabTerminator_checkInterval === undefined) {
                chrome.storage.sync.set({TimeTabTerminator_checkInterval: 1});
            }
        });

    updateAlarm(); // Ensure the alarm is set up with the current or default interval
})();

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "TimeTabTerminator_check") {

        // Proceed with the age check and closing logic for non-active tabs
        const currentTime = Date.now();

        console.log("-------------------- > triggered at", currentTime.toLocaleString());

        chrome.storage.sync.get(['TimeTabTerminator_closeAfter'], function(data) {

            chrome.windows.getAll({populate: true}, (windows) => {

                console.log("windows found:", windows.length);

                windows.forEach((window) => {

                    window.tabs.forEach((tab) => {

                        console.log("next tab:",  tab.title, tab);

                        let skippingReason = [];
                        if (tab.active) skippingReason.push('isActive');
                        if (tab.audible) skippingReason.push('isAudible');
                        if (tab.pinned) skippingReason.push('isPinned');
                        if (tab.groupId !== -1) skippingReason.push('isInAGroup');

                        if (skippingReason.length>0){
                            console.log("    keeping tab open because ", skippingReason)
                            return
                        }

                        const closeAfter = data.TimeTabTerminator_closeAfter || 5;
                        const lastAccessed =  tab.lastAccessed || currentTime;
                        const terminationTime = lastAccessed + (closeAfter * 60000)

                        if (terminationTime > currentTime) {
                            console.log("     closing tab ", tab.title, "in", (terminationTime - currentTime) / 60000, "minutes" )
                            return
                        }

                        console.log("tab closed:", tab.title)
                        chrome.tabs.remove(tab.id);
                    });
                });
            });
        });
    }
});

function updateAlarm() {
    chrome.storage.sync.get(['TimeTabTerminator_checkInterval'], function(data) {
        const periodInMinutes = parseInt(data.TimeTabTerminator_checkInterval, 10) || 5;
        chrome.alarms.clear("TimeTabTerminator_check", () => {
            chrome.alarms.create("TimeTabTerminator_check", { periodInMinutes: periodInMinutes });
        });
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.TimeTabTerminator_closeAfter) {
        updateAlarm(); // Update the alarm whenever the closeAfter setting changes
    }
});
