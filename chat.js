// Load messages from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadMessages();
});

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = messages.map(message => `<p>${message}</p>`).join("");
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();
  
  if (message) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push(message);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    
    loadMessages(); // Reload messages to include the new one
    input.value = ''; // Clear the input field
  }
}
