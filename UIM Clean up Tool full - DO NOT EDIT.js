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
                            // Retry mechanism for SIM hyperlink
                            retryUntilElementFound(
                                'pt1:MA:0:n1:1:pt1:pc1:ldrt:0:cl1',
                                function(simHyperlink) {
                                    console.log('Clicked simHyperlink:', simHyperlink);
                                    simHyperlink.click();
                                    setTimeout(function() {
                                        // Retry for Services link
                                        retryUntilElementFound(
                                            'pt1:MA:0:n1:2:pt1:r10:0:j_id__ctru1pc12:t1:0:cl1',
                                            function(topServiceHyperlink) {
                                                console.log('Clicked topServiceHyperlink:', topServiceHyperlink);
                                                topServiceHyperlink.click();
                                                setTimeout(function() {
                                                    // Retry for Actions dropdown
                                                    retryUntilElementFound(
                                                        'pt1:MA:0:n1:3:pt1:j_id__ctru10pc6',
                                                        function(actionsDropdown) {
                                                            console.log('Clicked actionsDropdown:', actionsDropdown);
                                                            actionsDropdown.click();
                                                            setTimeout(function() {
                                                                var disconnectOption = document.getElementById('pt1:MA:0:n1:3:pt1:DISCONNECT');
                                                                console.log('Attempting to click disconnectOption:', disconnectOption);
                                                                if (disconnectOption) {
                                                                    disconnectOption.click();
                                                                    console.log('Clicked disconnectOption');
                                                                    setTimeout(function() {
                                                                        clickCompleteButton(index, processAttempt);
                                                                    }, 2000); // Reduced to 2 seconds
                                                                } else {
                                                                    handleElementNotFound(index, simCardNumber, 'Disconnect option');
                                                                }
                                                            }, 2000); // Reduced to 2 seconds
                                                        },
                                                        500, // Check every 500 ms
                                                        20,  // Try up to 20 times (10 seconds max)
                                                        index,
                                                        simCardNumber,
                                                        'Actions dropdown'
                                                    );
                                                }, 3000); // Reduced to 3 seconds
                                            },
                                            500, // Check every 500 ms
                                            20,  // Try up to 20 times (10 seconds max)
                                            index,
                                            simCardNumber,
                                            'Services link'
                                        );
                                    }, 3000); // Timeout #3 is still 3 seconds
                                },
                                500, // Check every 500 ms
                                20,  // Try up to 20 times (10 seconds max)
                                index,
                                simCardNumber,
                                'SIM hyperlink'
                            );
                        }, 2000); // Reduced to 2 seconds
                    } else {
                        handleElementNotFound(index, simCardNumber, 'Search button');
                    }
                } else {
                    handleElementNotFound(index, simCardNumber, 'SIM card input field');
                }
            }, 2000); // Reduced to 2 seconds
        } else {
            handleElementNotFound(index, simCardNumber, 'Logical Devices button');
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
                    handleElementNotFound(index, simCardNumber, 'Complete button');
                }
            }, 4000); // Reduced to 4 seconds
        } else {
            handleElementNotFound(index, simCardNumber, 'Complete button');
        }
    }

    // Retry mechanism: Keep checking for an element until it's found or timeout
    function retryUntilElementFound(elementId, onSuccess, retryInterval, maxAttempts, index, simCardNumber, elementName) {
        var attemptCount = 0;
        var intervalId = setInterval(function() {
            var element = document.getElementById(elementId);
            if (element) {
                clearInterval(intervalId); // Stop retrying when the element is found
                onSuccess(element);        // Call the success callback with the element
            } else if (attemptCount >= maxAttempts) {
                clearInterval(intervalId); // Stop retrying after max attempts
                handleElementNotFound(index, simCardNumber, elementName);
            }
            attemptCount++;
        }, retryInterval);
    }

    // If an element isn't found, log the failure with reason and move to the next SIM card
    function handleElementNotFound(index, simCardNumber, elementName) {
        var failureMessage = 'Element not found while trying to click ' + elementName + ' for SIM card: ' + simCardNumber;
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
