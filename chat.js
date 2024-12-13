// Wait for the DOM to fully load before starting
document.addEventListener("DOMContentLoaded", () => {
  // Check if username is saved in localStorage, if not, ask for the name
  let username = localStorage.getItem("username");

  if (!username) {
    // Ask for the name and store it in localStorage if it's not already saved
    username = prompt("What is your name?");
    if (username) {
      localStorage.setItem("username", username);  // Store username in localStorage
    } else {
      alert("Name is required to chat!");
      return;  // Stop if no name is provided
    }
  }

  // Load and display the messages when the page loads
  loadMessages();

  // Refresh the chat every 0.1 seconds
  setInterval(loadMessages, 100);  // Reloads messages every 100 milliseconds
});

// Function to load messages from localStorage
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const messagesContainer = document.getElementById("messages");

  // Clear previous messages and load the new ones
  messagesContainer.innerHTML = messages.map(message => 
    `<div class="message ${message.username === localStorage.getItem("username") ? 'user' : ''}">
      <strong>${message.username}:</strong> ${message.text}
    </div>`
  ).join("");
}

// Function to send a message
function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const messageText = messageInput.value.trim();

  if (messageText) {
    // Retrieve existing messages from localStorage or create an empty array
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

    // Get the stored username from localStorage
    const username = localStorage.getItem("username");

    // Push the new message with the username
    messages.push({ username: username, text: messageText });

    // Save the updated messages back to localStorage
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    // Clear the message input field after sending the message
    messageInput.value = '';
  }
}
