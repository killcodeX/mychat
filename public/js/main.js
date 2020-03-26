const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);
});


// Output Message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p><p class="text">${message}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}