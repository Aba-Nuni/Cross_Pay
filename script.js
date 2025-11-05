// Smooth scrolling for nav links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// CTA Button scroll
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#solution').scrollIntoView({ behavior: 'smooth' });
});

// Exchange rates for chatbot demo
const exchangeRates = {
    'USD_MUR': { rate: 45.50, country: 'Mauritius', fee: 2.0 },  // USD → Mauritian Rupee
    'USD_ZAR': { rate: 20.10, country: 'South Africa', fee: 2.5 }, // USD → South African Rand
    'USD_UGX': { rate: 3780.00, country: 'Uganda', fee: 2.0 },    // USD → Ugandan Shilling
    'USD_USD': { rate: 1.00, country: 'USA', fee: 0 }              // USD → USD (no conversion)
};

function handleChatInput(event) {
    if (event && event.key !== 'Enter' && event.type !== 'click') return;
    
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    const messagesDiv = document.getElementById('chatMessages');
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messagesDiv.appendChild(userMsg);

    // Generate bot response
    let botResponse = generateResponse(message);
    
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot-message';
        botMsg.innerHTML = `<p>${botResponse}</p>`;
        messagesDiv.appendChild(botMsg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 500);

    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function generateResponse(input) {
    input = input.toLowerCase();

    if (input.includes('send') && input.includes('$')) {
        const amount = input.match(/\$?\d+/)?.[0] || '100';
        if (input.includes('mauritius') || input.includes('mur')) {
            return generateTransferInfo(amount, 'USD_MUR');
        } else if (input.includes('south africa') || input.includes('zar')) {
            return generateTransferInfo(amount, 'USD_ZAR');
        } else if (input.includes('uganda') || input.includes('ugx')) {
            return generateTransferInfo(amount, 'USD_UGX');
        } else if (input.includes('usa') || input.includes('usd')) {
            return generateTransferInfo(amount, 'USD_USD');
        }
    }

    if (input.includes('fee') || input.includes('charge') || input.includes('cost')) {
        return `💰 <strong>Fee Breakdown Example (USD $100 transfer):</strong><br>
                Bank fee: $2.50<br>
                Currency markup: $1.50<br>
                Partner fee: $0.50<br>
                <strong>Total deduction: $4.50</strong><br>
                You send: $100 → Recipient gets: $95.50 (after all fees)<br><br>
                Our system shows this <strong>BEFORE</strong> you confirm, so no surprises!`;
    }

    if (input.includes('compare') || input.includes('vs')) {
        return `📊 <strong>Exchange Rate Comparison:</strong><br>
                <strong>Mauritius (MUR):</strong> 1 USD = 45.50 MUR<br>
                <strong>South Africa (ZAR):</strong> 1 USD = 20.10 ZAR<br>
                <strong>Uganda (UGX):</strong> 1 USD = 3,780 UGX<br>
                <strong>USA (USD):</strong> 1 USD = 1 USD<br><br>
                💡 Rates vary by corridor. CrossPay shows you the best rates in real-time!`;
    }

    if (input.includes('arrive') || input.includes('receive')) {
        return `✅ <strong>What will arrive?</strong><br>
                That depends on:<br>
                1. The amount you send<br>
                2. The destination country<br>
                3. Current exchange rate (live-updated)<br>
                4. Total fees (always shown upfront)<br><br>
                Example: Send $100 to Mauritius<br>
                Exchange: $100 × 45.50 = 4,550 MUR<br>
                After fees (~2%): 4,459 MUR (~$98)<br><br>
                Try asking: "How much arrives if I send $100 to Mauritius?"`;
    }

    return `🤔 Great question! I can help with:<br>
            💬 "Send $X to [country]?" → Shows exact arrival amount<br>
            💬 "What are the fees?" → Breaks down all charges<br>
            💬 "Compare rates?" → Shows current rates<br>
            💬 "Exchange rate for [country]?" → Gives live rates<br><br>
            Try one of these to see how transparent CrossPay is!`;
}

function generateTransferInfo(amount, corridor) {
    const data = exchangeRates[corridor];
    const received = (amount * data.rate * (1 - data.fee / 100)).toFixed(2);
    const currencyCode = corridor.split('_')[1];
    
    return `✅ <strong>Transfer Summary</strong><br>
            You send: $${amount} USD<br>
            Exchange rate: 1 USD = ${data.rate} ${currencyCode}<br>
            Gross: ${(amount * data.rate).toFixed(0)} ${currencyCode}<br>
            Fee applied: ${data.fee}%<br>
            <strong>Recipient receives: ${received} ${currencyCode}</strong><br><br>
            💡 This amount is guaranteed before you send. No surprises!`;
}

/**
 * Escapes HTML characters in a string.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
