// Ask for the user's name every time the page is loaded
const username = prompt("What is your name?");
if (!username) {
  alert("Name is required to chat!");
  return; // Stop execution if no name is entered
}

// Load messages from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadMessages();
  
  // Refresh chat every 0.1 seconds (100ms)
  setInterval(loadMessages, 100);  // This will reload the chat every 100 milliseconds
});

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const messagesContainer = document.getElementById("messages");

  // Clear previous messages and load the new ones
  messagesContainer.innerHTML = messages.map(message => 
    `<div class="message ${message.username === username ? 'user' : ''}">
      <strong>${message.username}:</strong> ${message.text}
    </div>`
  ).join("");
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const messageText = input.value.trim();
  
  if (messageText) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    
    // Push message with username
    messages.push({ username: username, text: messageText });
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    
    input.value = ''; // Clear the input field
  }
}
