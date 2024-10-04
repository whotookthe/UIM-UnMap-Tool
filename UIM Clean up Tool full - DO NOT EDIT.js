(function() {
    'use strict';

    var simCardNumbers = [];
    var currentIndex = 0;
    var processCount = {}; // To track process count for each SIM card
    var failedSimCards = []; // To track SIM cards that couldn't be processed

    function processSimCard(index, processAttempt) {
        if (index >= simCardNumbers.length) {
            console.log('All SIM cards processed twice.');
            displayFailedSimCards(); // Display failed SIMs at the end
            return;
        }

        var simCardNumber = simCardNumbers[index];
        console.log('Processing SIM card number:', simCardNumber, 'Attempt:', processAttempt);

        if (!processCount[simCardNumber]) {
            processCount[simCardNumber] = 0;
        }

        if (processCount[simCardNumber] >= 2) {
            console.log('SIM card number', simCardNumber, 'has been processed twice. Moving to the next SIM card.');
            processSimCard(index + 1, 1); // Move to the next SIM card with processAttempt 1
            return;
        }

        // Update process count
        processCount[simCardNumber]++;

        // Initial click to start the process Logical Devices Button
        var firstElement = document.getElementById('pt1:pt_r1:0:d1:0:j_id13');
        console.log('Attempting to click firstElement:', firstElement);
        if (firstElement) {
            firstElement.click();
            console.log('Clicked firstElement');
            setTimeout(function() {
                // Input field for SIM card number
                var simInput = document.getElementById('pt1:MA:0:n1:1:pt1:i3:0:text::content');
                console.log('Attempting to find simInput:', simInput);
                if (simInput) {
                    simInput.value = simCardNumber;
                    // Search button
                    var searchButton = document.getElementById('pt1:MA:0:n1:1:pt1:searchButton');
                    console.log('Attempting to click searchButton:', searchButton);
                    if (searchButton) {
                        searchButton.click();
                        console.log('Clicked searchButton');
                        setTimeout(function() {
                            // SIM hyperlink in search results
                            var simHyperlink = document.getElementById('pt1:MA:0:n1:1:pt1:pc1:ldrt:0:cl1');
                            console.log('Attempting to click simHyperlink:', simHyperlink);
                            if (simHyperlink) {
                                simHyperlink.click();
                                console.log('Clicked simHyperlink');
                                setTimeout(function() {
                                    // "Services" button link
                                    var topServiceHyperlink = document.getElementById('pt1:MA:0:n1:2:pt1:r10:0:j_id__ctru1pc12:t1:0:cl1');
                                    console.log('Attempting to click topServiceHyperlink:', topServiceHyperlink);
                                    if (topServiceHyperlink) {
                                        topServiceHyperlink.click();
                                        console.log('Clicked topServiceHyperlink');
                                        setTimeout(function() {
                                            // Actions dropdown
                                            var actionsDropdown = document.getElementById('pt1:MA:0:n1:3:pt1:j_id__ctru10pc6');
                                            console.log('Attempting to click actionsDropdown:', actionsDropdown);
                                            if (actionsDropdown) {
                                                actionsDropdown.click();
                                                console.log('Clicked actionsDropdown');
                                                setTimeout(function() {
                                                    // Disconnect option in actions dropdown
                                                    var disconnectOption = document.getElementById('pt1:MA:0:n1:3:pt1:DISCONNECT');
                                                    console.log('Attempting to click disconnectOption:', disconnectOption);
                                                    if (disconnectOption) {
                                                        disconnectOption.click();
                                                        console.log('Clicked disconnectOption');
                                                        setTimeout(function() {
                                                            // Directly click the Complete button
                                                            clickCompleteButton(index, processAttempt);
                                                        }, 2000); // Reduced to 2 seconds
                                                    } else {
                                                        handleElementNotFound(index, simCardNumber, 'Disconnect option not found');
                                                    }
                                                }, 2000); // Reduced to 2 seconds
                                            } else {
                                                handleElementNotFound(index, simCardNumber, 'Actions dropdown not found');
                                            }
                                        }, 3000); // Reduced to 3 seconds
                                    } else {
                                        handleElementNotFound(index, simCardNumber, 'Services link not found');
                                    }
                                }, 3000); // Timeout #3: Increased to 3 seconds
                            } else {
                                handleElementNotFound(index, simCardNumber, 'SIM hyperlink not found');
                            }
                        }, 2000); // Reduced to 2 seconds
                    } else {
                        handleElementNotFound(index, simCardNumber, 'Search button not found');
                    }
                } else {
                    handleElementNotFound(index, simCardNumber, 'SIM card input field not found');
                }
            }, 2000); // Reduced to 2 seconds
        } else {
            handleElementNotFound(index, simCardNumber, 'Logical Devices button not found');
        }
    }

    function clickCompleteButton(index, processAttempt) {
        var completeButton = document.getElementById('pt1:MA:0:n1:3:pt1:COMPLETE');
        console.log('Attempting to click completeButton by ID:', completeButton);

        if (completeButton) {
            // Ensure the button is visible in the viewport
            completeButton.scrollIntoView({behavior: 'smooth', block: 'center'});
            
            // Wait for a short time to ensure the button is fully rendered
            setTimeout(function() {
                try {
                    completeButton.click();
                    console.log('Clicked on COMPLETE button.');
                    setTimeout(function() {
                        // Proceed to the next attempt or the next SIM card
                        if (processAttempt < 2) {
                            processSimCard(index, processAttempt + 1); // Process the same SIM card again
                        } else {
                            processSimCard(index + 1, 1); // Move to the next SIM card
                        }
                    }, 9000); // Reduced to 9 seconds
                } catch (error) {
                    console.log('Error clicking on COMPLETE:', error);
                    handleElementNotFound(index, simCardNumber, 'Error clicking on COMPLETE');
                }
            }, 4000); // Reduced to 4 seconds
        } else {
            handleElementNotFound(index, simCardNumber, 'Complete button not found');
        }
    }

    // If an element isn't found, log the failure with reason and move to the next SIM card
    function handleElementNotFound(index, simCardNumber, reason) {
        var failureMessage = 'Element not found (' + reason + ') for SIM card: ' + simCardNumber;
        console.log(failureMessage);
        failedSimCards.push(failureMessage); // Track the reason along with the SIM card
        processSimCard(index + 1, 1); // Move to the next SIM card
    }

    // Display a popup listing failed SIM cards and reasons
    function displayFailedSimCards() {
        if (failedSimCards.length > 0) {
            alert('The following SIM cards could not be processed:\n' + failedSimCards.join('\n'));
        } else {
            alert('All SIM cards were processed successfully.');
        }
    }

    // Function to create the GUI for entering SIM card numbers
    function createSimCardGUI() {
        var simInput = window.prompt('Enter SIM card numbers separated by spaces:');
        if (simInput) {
            simCardNumbers = simInput.trim().split(' ');
            console.log('SIM card numbers:', simCardNumbers);
            processSimCard(0, 1); // Start processing with the first SIM card and first attempt
        } else {
            console.log('No SIM card numbers entered.');
        }
    }

    // Call the function to create the SIM card GUI
    createSimCardGUI();

})();
