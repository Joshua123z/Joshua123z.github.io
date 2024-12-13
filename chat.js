// Ask for the user's name if it's not already stored
if (!localStorage.getItem("username")) {
  const username = prompt("What is your name?");
  if (username) {
    localStorage.setItem("username", username);
  }
}

// Load messages from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadMessages();
  
  // Refresh chat every 0.1 seconds (100ms)
  setInterval(loadMessages, 100);
});

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const messagesContainer = document.getElementById("messages");

  // Clear previous messages and load the new ones
  messagesContainer.innerHTML = messages.map(message => `<p><strong>${message.username}:</strong> ${message.text}</p>`).join("");
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const messageText = input.value.trim();
  
  if (messageText) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const username = localStorage.getItem("username"); // Get the user's name from local storage
    
    messages.push({ username: username, text: messageText });
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    
    input.value = ''; // Clear the input field
  }
}
