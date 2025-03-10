document.addEventListener("DOMContentLoaded", function() {
    let balance = 0;
    const balanceDisplay = document.getElementById('balance');
    const inputContainer = document.getElementById('input-container');
    const moneyInput = document.getElementById('moneyInput');
    const submitAmountButton = document.getElementById('submitAmount');
    const botonMas = document.getElementById('botonMas');
    const botonMenos = document.querySelector('button img[alt="BotonMenos"]');
    const topSaldo = document.getElementById('topSaldo');
    
    let activeInputContainer = null;

    // Function to update the balance and display it correctly
    function updateBalance() {
        balanceDisplay.textContent = "Saldo: $" + balance;

        // Update topSaldo to show current balance
        topSaldo.textContent = "$" + balance;
    }

    // Initially set the topSaldo to $0
    topSaldo.textContent = "$0";

    botonMas.addEventListener('click', function() {
        inputContainer.style.display = 'block';
        moneyInput.placeholder = "Agregar Cantidad";
    });

    botonMenos.addEventListener('click', function() {
        inputContainer.style.display = 'block';
        moneyInput.placeholder = "Restar Cantidad";
    });

    submitAmountButton.addEventListener('click', function() {
        const enteredAmount = parseFloat(moneyInput.value);
        if (!isNaN(enteredAmount) && enteredAmount > 0) {
            if (moneyInput.placeholder === "Restar Cantidad") {
                balance -= enteredAmount; // Subtract amount from balance
            } else {
                balance += enteredAmount; // Add amount to balance
            }
            updateBalance();  // Update balance and display
        }
        moneyInput.value = ''; // Clear the input field
        inputContainer.style.display = 'none'; // Hide the input container
    });

    moneyInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitAmountButton.click();
        }
    });

    document.querySelectorAll('.circle-container .button').forEach((button) => {
        button.addEventListener('click', function(event) {
            // Remove "Cantidad inválida!" if exists
            const invalidMessage = document.querySelector('.invalid-message');
            if (invalidMessage) {
                invalidMessage.remove();
            }

            // If there is an active input container, remove it
            if (activeInputContainer) {
                activeInputContainer.remove();
            }

            // Create a new input container for the clicked button
            let newInputContainer = document.createElement('div');
            newInputContainer.className = 'circleInputContainer';
            newInputContainer.style.display = 'flex';
            newInputContainer.style.flexDirection = 'column';
            newInputContainer.style.alignItems = 'center';
            newInputContainer.style.gap = '5px';
            newInputContainer.style.position = 'absolute';
    
            const buttonRect = event.target.getBoundingClientRect();
            const inputTop = buttonRect.bottom + window.scrollY + 5;
    
            const balanceRect = balanceDisplay.getBoundingClientRect();
            const maxInputTop = balanceRect.top - newInputContainer.offsetHeight;
    
            newInputContainer.style.top = Math.min(inputTop, maxInputTop) + 'px';
            newInputContainer.style.left = `${buttonRect.left + window.scrollX}px`;
    
            let inputField = document.createElement('input');
            inputField.type = 'text'; // Change input type to text for placeholder
            inputField.className = 'circleTextInput';
            inputField.placeholder = button.id === "botonMas" ? "Agregar Cantidad" : "Restar Cantidad"; // Set different placeholder based on button clicked
    
            let enviarButton = document.createElement('button');
            enviarButton.className = 'enviarButton';
            enviarButton.textContent = 'Enviar';
            
            // Create a span for the percentage
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'percentageDisplay';
            percentageSpan.style.fontSize = '14px';
            newInputContainer.appendChild(inputField);
            newInputContainer.appendChild(enviarButton);
            newInputContainer.appendChild(percentageSpan);
    
            document.body.appendChild(newInputContainer);
    
            activeInputContainer = newInputContainer; // Set the new input container as active
    
            // Calculate percentage and update the button when clicking "Enviar"
            enviarButton.addEventListener('click', function() {
                const enteredAmount = parseFloat(inputField.value);
                if (enteredAmount <= 0 || enteredAmount > balance || balance === 0) {
                    // If entered amount is invalid or no saldo, show the message **under** the button
                    const invalidMessage = document.createElement('div');
                    invalidMessage.className = 'invalid-message';
                    invalidMessage.style.color = 'red';
                    invalidMessage.style.fontSize = '12px';
                    invalidMessage.textContent = "Cantidad inválida!";
                    button.appendChild(invalidMessage); // Append message under the button
                    percentageSpan.textContent = ''; // Clear the percentage display
                } else {
                    const percentage = (enteredAmount / balance) * 100;
                    percentageSpan.textContent = `${Math.round(percentage)}%`; // Display the percentage
                    
                    if (button.querySelector('img[alt="Ropa.png"]')) {
                        // If the button is the "Ropa.png" button, position percentage on top
                        let percentageText = document.createElement('span');
                        percentageText.textContent = `${Math.round(percentage)}%`;
                        percentageText.style.position = 'absolute';
                        percentageText.style.top = '-20px'; // Position it above the button
                        percentageText.style.left = '50%';  // Center it horizontally
                        percentageText.style.transform = 'translateX(-50%)';  // Center it exactly
                        percentageText.style.textAlign = 'center';
                        percentageText.style.fontSize = '14px';
                        
                        button.appendChild(percentageText); // Append it above the button
                    } else {
                        // Default: percentage displayed below button
                        let percentageText = document.createElement('span');
                        percentageText.textContent = `${Math.round(percentage)}%`;
                        percentageText.style.position = 'absolute';
                        percentageText.style.top = '100%';  // Position it directly below the image
                        percentageText.style.left = '50%';  // Center it horizontally
                        percentageText.style.transform = 'translateX(-50%)';  // Center it exactly
                        percentageText.style.textAlign = 'center';
                        percentageText.style.fontSize = '14px';
                        
                        button.appendChild(percentageText);
                    }
                }
                // Clear input and hide the input container after clicking Enviar
                inputField.value = '';
                inputField.placeholder = ''; // Remove the placeholder text
                newInputContainer.style.display = 'none'; // Hide the input container
            });

            // Listen for input changes
            inputField.addEventListener('input', function() {
                const enteredAmount = parseFloat(inputField.value);
                if (!isNaN(enteredAmount) && balance > 0 && enteredAmount <= balance) {
                    const percentage = (enteredAmount / balance) * 100;
                    percentageSpan.textContent = `${Math.round(percentage)}%`; // Removed "Porcentaje: "
                } else {
                    percentageSpan.textContent = ''; // Clear percentage if invalid
                }
            });
        });
    });
});
