(function() {
    // DOM элементы
    const display = document.getElementById('temperature-display');
    
    const digitButtons = document.querySelectorAll('[id^="digit-"]');
    const clearBtn = document.getElementById('station-clear');
    const signBtn = document.getElementById('station-sign');
    const percentBtn = document.getElementById('station-percent');
    const divideBtn = document.getElementById('station-divide');
    const multiplyBtn = document.getElementById('station-multiply');
    const minusBtn = document.getElementById('station-minus');
    const plusBtn = document.getElementById('station-plus');
    const equalsBtn = document.getElementById('station-equals');
    const dotBtn = document.getElementById('digit-dot');
    const paToAtmBtn = document.getElementById('station-pa-to-atm');
    
    // Состояние калькулятора
    let currentInput = '0';
    let previousValue = null;
    let currentOperator = null;
    let waitingForOperand = false;
    let expressionEvaluated = false;
    
    function updateDisplay() {
        let displayValue = currentInput;
        if (displayValue.length > 18) {
            displayValue = parseFloat(displayValue).toExponential(10);
        }
        display.innerText = displayValue;
    }
    
    function inputDigit(digit) {
        if (waitingForOperand) {
            currentInput = digit;
            waitingForOperand = false;
            expressionEvaluated = false;
        } else {
            if (currentInput === '0' && digit !== '.') {
                currentInput = digit;
            } else {
                currentInput = currentInput + digit;
            }
        }
        updateDisplay();
    }
    
    function inputDecimal() {
        if (waitingForOperand) {
            currentInput = '0.';
            waitingForOperand = false;
            expressionEvaluated = false;
            updateDisplay();
            return;
        }
        if (currentInput.includes('.')) return;
        currentInput = currentInput + '.';
        updateDisplay();
    }
    
    function resetCalculator() {
        currentInput = '0';
        previousValue = null;
        currentOperator = null;
        waitingForOperand = false;
        expressionEvaluated = false;
        updateDisplay();
    }
    
    function toggleSign() {
        let number = parseFloat(currentInput);
        if (isNaN(number)) return;
        number = -number;
        currentInput = number.toString();
        updateDisplay();
    }
    
    function percentOperation() {
        let number = parseFloat(currentInput);
        if (isNaN(number)) return;
        if (previousValue !== null && currentOperator && waitingForOperand === false) {
            let percentValue = previousValue * (number / 100);
            currentInput = percentValue.toString();
            updateDisplay();
        } else {
            let percentResult = number / 100;
            currentInput = percentResult.toString();
            updateDisplay();
        }
        waitingForOperand = true;
        expressionEvaluated = false;
    }
    
    // ИНДИВИДУАЛЬНАЯ ОПЕРАЦИЯ: Перевод давления из Паскалей в Атмосферы
    // 1 атмосфера = 101325 Паскалей
    function convertPaToAtm() {
        let value = parseFloat(currentInput);
        if (isNaN(value)) {
            currentInput = '0';
            updateDisplay();
            return;
        }
        const ATM_STANDARD = 101325;
        let result = value / ATM_STANDARD;
        // Округляем до 6 знаков для читаемости
        result = parseFloat(result.toFixed(10));
        currentInput = result.toString();
        // Сбрасываем состояние калькулятора после операции
        previousValue = null;
        currentOperator = null;
        waitingForOperand = true;
        expressionEvaluated = true;
        updateDisplay();
    }
    
    function calculate(operator, a, b) {
        a = parseFloat(a);
        b = parseFloat(b);
        if (isNaN(a) || isNaN(b)) return NaN;
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': 
                if (b === 0) return NaN;
                return a / b;
            default: return NaN;
        }
    }
    
    function setOperator(operator) {
        const currentVal = parseFloat(currentInput);
        
        if (previousValue !== null && currentOperator && waitingForOperand) {
            currentOperator = operator;
            return;
        }
        
        if (previousValue !== null && currentOperator && !waitingForOperand) {
            let result = calculate(currentOperator, previousValue, currentVal);
            if (isNaN(result) || !isFinite(result)) {
                display.innerText = 'Ошибка';
                resetCalculator();
                return;
            }
            previousValue = result;
            currentInput = result.toString();
            updateDisplay();
        } else {
            previousValue = currentVal;
        }
        
        currentOperator = operator;
        waitingForOperand = true;
        expressionEvaluated = false;
    }
    
    function evaluate() {
        if (previousValue === null || currentOperator === null || waitingForOperand) {
            return;
        }
        const currentVal = parseFloat(currentInput);
        let result = calculate(currentOperator, previousValue, currentVal);
        if (isNaN(result) || !isFinite(result)) {
            display.innerText = 'Ошибка';
            resetCalculator();
            return;
        }
        result = parseFloat(result.toFixed(10));
        currentInput = result.toString();
        updateDisplay();
        previousValue = null;
        currentOperator = null;
        waitingForOperand = true;
        expressionEvaluated = true;
    }
    
    // Обработчики цифр
    digitButtons.forEach(btn => {
        const digit = btn.innerText;
        if (btn.id === 'digit-dot') return;
        btn.addEventListener('click', () => {
            if (expressionEvaluated && !waitingForOperand) {
                resetCalculator();
            }
            inputDigit(digit);
        });
    });
    
    if (dotBtn) {
        dotBtn.addEventListener('click', () => {
            if (expressionEvaluated && !waitingForOperand) {
                resetCalculator();
            }
            inputDecimal();
        });
    }
    
    clearBtn.addEventListener('click', resetCalculator);
    
    signBtn.addEventListener('click', () => {
        if (expressionEvaluated && !waitingForOperand) {
            resetCalculator();
        }
        toggleSign();
    });
    
    percentBtn.addEventListener('click', () => {
        if (expressionEvaluated && !waitingForOperand) {
            resetCalculator();
        }
        percentOperation();
    });
    
    // Индивидуальная операция: Паскаль → Атмосфера
    if (paToAtmBtn) {
        paToAtmBtn.addEventListener('click', () => {
            convertPaToAtm();
        });
    }
    
    plusBtn.addEventListener('click', () => setOperator('+'));
    minusBtn.addEventListener('click', () => setOperator('-'));
    multiplyBtn.addEventListener('click', () => setOperator('×'));
    divideBtn.addEventListener('click', () => setOperator('÷'));
    equalsBtn.addEventListener('click', evaluate);
    
    // Поддержка клавиатуры
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key >= '0' && key <= '9') {
            if (expressionEvaluated && !waitingForOperand) resetCalculator();
            inputDigit(key);
            e.preventDefault();
        } else if (key === '.') {
            if (expressionEvaluated && !waitingForOperand) resetCalculator();
            inputDecimal();
            e.preventDefault();
        } else if (key === '+' || key === '-') {
            setOperator(key === '+' ? '+' : '-');
            e.preventDefault();
        } else if (key === '*' || key === '×') {
            setOperator('×');
            e.preventDefault();
        } else if (key === '/') {
            setOperator('÷');
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            evaluate();
            e.preventDefault();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            resetCalculator();
            e.preventDefault();
        } else if (key === '%') {
            percentOperation();
            e.preventDefault();
        }
    });
    
    // Тёмная тема
    const themeBtn = document.getElementById('theme-switch');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('weather_theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeBtn.innerHTML = '☀️ Светлый режим';
    } else {
        themeBtn.innerHTML = '🌙 Ночной режим';
    }
    
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('weather_theme', isDark ? 'dark' : 'light');
        themeBtn.innerHTML = isDark ? '☀️ Светлый режим' : '🌙 Ночной режим';
    });
    
    resetCalculator();
})();