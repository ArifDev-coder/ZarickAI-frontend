document.addEventListener("DOMContentLoaded", () => {
    const socket = io("https://arifdev.pythonanywhere.com/");
    const input = document.getElementById("user-input");
    const form = document.getElementById("input-form");
    const chatBox = document.getElementById("chat-box");    // Handle socket connection errors
    socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        // Check if error message already exists
        const existingError = chatBox.querySelector('.error-message');
        if (!existingError) {
            const errorBubble = document.createElement("div");
            errorBubble.classList.add("self-start", "max-w-[70%]", "bg-red-500", "text-white", "p-2", "rounded", "mb-2", "error-message");
            errorBubble.textContent = "Error connecting to server. Please try again later.";
            chatBox.appendChild(errorBubble);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    // Handle AI responses
    socket.on("response", (data) => {
        const loadingBubble = document.querySelector(".loading-bubble");
        const timeut = Math.floor(Math.random() * 10);
        
        const botBubble = document.createElement("div");
        botBubble.classList.add("hidden", "self-start", "max-w-[70%]", "text-white", "p-2", "rounded", "mb-2");
        chatBox.appendChild(botBubble);

        if (loadingBubble) {
            setTimeout(() => {
                loadingBubble.remove();
                botBubble.classList.remove("hidden");
                
                const text = data.message;
                let i = 0;                
                function typeAnimation() {
                    if (i < text.length) {
                        // Convert \n to <br> for HTML display
                        const char = text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                        botBubble.innerHTML += char;
                        i++;
                        setTimeout(typeAnimation, 30);
                    } else {
                        chatBox.scrollTop = chatBox.scrollHeight;
                    }
                }
                typeAnimation();
                botBubble.classList.add("bg-gray-700");
                
            }, timeut);

        }
    });
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const message = input.value.trim();
        if (!message) return;

        const userBubble = document.createElement("div");
        userBubble.classList.add("self-end", "max-w-[70%]", "bg-blue-500", "text-white", "p-2", "rounded", "mb-2");
        userBubble.textContent = message;
        chatBox.appendChild(userBubble);

        socket.emit("message", message);

        input.value = "";
        input.focus();
        
        const loadingBubble = document.createElement("div");
        loadingBubble.classList.add("loading-bubble", "self-start", "max-w-[70%]", "bg-gray-700", "text-white", "p-2", "rounded", "mb-2", "flex", "items-center");
        
        const spinner = document.createElement("div");
        spinner.classList.add("w-4", "h-4", "border-4", "border-t-blue-500", "border-gray-300", "rounded-full", "animate-spin", "mr-2");

        const loadingText = document.createElement("span");
        loadingText.textContent = "ZarickAI is thinking...";

        loadingBubble.appendChild(spinner);
        loadingBubble.appendChild(loadingText);
        chatBox.appendChild(loadingBubble);

        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
