(function() {
    'use strict';

    var simCardNumbers = [];

    function processSimCard(index) {
        if (index >= simCardNumbers.length) {
            console.log('All SIM cards processed.');
            return;
        }

        console.log('Processing SIM card number:', simCardNumbers[index]);

        // Initial click to start the process Logical Devices Button
        var firstElement = document.getElementById('pt1:pt_r1:0:d1:0:j_id13');
        if (firstElement) {
            firstElement.click();
            setTimeout(function() {
                // Input field for SIM card number
                var simInput = document.getElementById('pt1:MA:0:n1:1:pt1:i3:0:text::content');
                if (simInput) {
                    simInput.value = simCardNumbers[index];
                    // Search button
                    var searchButton = document.getElementById('pt1:MA:0:n1:1:pt1:searchButton');
                    if (searchButton) {
                        searchButton.click();
                        setTimeout(function() {
                            // SIM hyperlink in search results
                            var simHyperlink = document.getElementById('pt1:MA:0:n1:1:pt1:pc1:ldrt:0:cl1');
                            if (simHyperlink) {
                                simHyperlink.click();
                                setTimeout(function() {
                                    // "Services" button link
                                    var topServiceHyperlink = document.getElementById('pt1:MA:0:n1:2:pt1:r10:0:j_id__ctru1pc12:t1:0:cl1');
                                    if (topServiceHyperlink) {
                                        topServiceHyperlink.click();
                                        setTimeout(function() {
                                            // Actions dropdown
                                            var actionsDropdown = document.getElementById('pt1:MA:0:n1:3:pt1:j_id__ctru10pc6');
                                            if (actionsDropdown) {
                                                actionsDropdown.click();
                                                setTimeout(function() {
                                                    // Disconnect option in actions dropdown
                                                    var disconnectOption = document.getElementById('pt1:MA:0:n1:3:pt1:DISCONNECT');
                                                    if (disconnectOption) {
                                                        disconnectOption.click();
                                                        setTimeout(function() {
                                                            // Complete option to finalize the process using XPath
                                                            var completeOption = document.evaluate('//*[@id="pt1:MA:0:n1:3:pt1:COMPLETE"]/td[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                                            if (completeOption) {
                                                                completeOption.click();
                                                                console.log('Clicked on COMPLETE for SIM card:', simCardNumbers[index]);
                                                                setTimeout(function() {
                                                                    processSimCard(index + 1); // Process the next SIM card after a delay
                                                                }, 10000); // Delay before starting the next SIM card process, adjust as needed
                                                            } else {
                                                                console.log('COMPLETE option not found for SIM card:', simCardNumbers[index]);
                                                                processSimCard(index + 1); // Process the next SIM card
                                                            }
                                                        }, 2000); // Wait for disconnectOption before clicking on completeOption
                                                    }
                                                }, 2000); // Wait for actionsDropdown before clicking on disconnectOption
                                            }
                                        }, 3000); // Wait for topServiceHyperlink before clicking on actionsDropdown
                                    }
                                }, 3000); // Wait for simHyperlink before clicking on topServiceHyperlink
                            }
                        }, 2000); // Wait for searchButton before clicking on simHyperlink
                    }
                }
            }, 1000); // Wait for simInput before clicking on searchButton
        }
    }

    // Function to create the GUI for entering SIM card numbers
    function createSimCardGUI() {
        var simInput = window.prompt('Enter SIM card numbers separated by spaces:');
        if (simInput) {
            simCardNumbers = simInput.trim().split(' ');
            console.log('SIM card numbers:', simCardNumbers);
            processSimCard(0); // Start processing with the first SIM card
        } else {
            console.log('No SIM card numbers entered.');
        }
    }

    // Call the function to create the SIM card GUI
    createSimCardGUI();

})();
