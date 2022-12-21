// Set up a listener that listens for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is a request for matching jobs
  if (request.type === 'get_matching_jobs') {
    // Get the URL of the Flask app
    const url = chrome.runtime.getURL('/');
    
    // Send a request to the Flask app
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(request.data)
    })
      .then((response) => response.json())
      .then((data) => {
        // Send a response with the matching jobs to the content script
        sendResponse(data);

        // Send a message to the popup page with the matching jobs data
        chrome.runtime.sendMessage({
          type: 'matching_jobs',
          data
        });
      });

    // Return true to indicate that a response will be sent asynchronously
    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'update_popup') {
    // Update the popup with the new results
    updatePopup(message.data);
  }
});

function updatePopup(data) {
  // Clear the existing results
  document.getElementById('results').innerHTML = '';

  // Loop through the matching jobs data and create a new element for each job
  data.forEach((job) => {
    const jobElement = document.createElement('div');
    jobElement.innerHTML = `<h2>${job.title}</h2><p>${job.client}</p>`;
    document.getElementById('results').appendChild(jobElement);
  });
}