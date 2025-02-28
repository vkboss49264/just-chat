const socket = io("http://localhost:3000");
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const controls = document.getElementById("controls");

// Append new messages to chat box
function appendMessage(text) {
    const msg = document.createElement("p");
    msg.innerText = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight; // Scroll to the bottom of the chat
}

// Show connected message when matched with a user
socket.on("matched", () => {
    appendMessage("You are connected!");
    messageInput.disabled = false; // Enable message input
    sendButton.disabled = false;  // Enable send button
    controls.classList.remove("hidden"); // Show control buttons
});

// Receive messages from the other user
socket.on("message", (msg) => appendMessage("Stranger: " + msg));

// Inform user when the other person disconnects
socket.on("partnerDisconnected", () => {
    appendMessage("Stranger has left.");
    resetChat();
});

// Function to send message
function sendMessage() {
    const msg = messageInput.value;
    if (msg.trim()) {
        appendMessage("You: " + msg);
        socket.emit("message", msg);
        messageInput.value = "";
    }
}

// Function to move to the next chat
function nextChat() {
    socket.emit("next");
    appendMessage("Finding a new stranger...");
    resetChat();
}

// Function to stop chat
function stopChat() {
    socket.disconnect();
    appendMessage("You have disconnected.");
    resetChat();
}

// Function to report inappropriate behavior (basic)
function reportUser() {
    socket.emit("report");
    appendMessage("You have reported this user.");
}

// Reset chat (clear chat window and disable input buttons)
function resetChat() {
    chat.innerHTML = ""; // Clear chat history
    messageInput.disabled = true;  // Disable message input
    sendButton.disabled = true;   // Disable send button
    controls.classList.add("hidden"); // Hide control buttons
}
