class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.split('').slice(0, -1).join('');
  }

  appendNumber(number) {
    this.currentOperand += number;
  }

  appendPrevious(str) {
    this.previousOperand += str;
  }

  currentToPrevious() {
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  chooseOperation(operation) {
    this.operation = operation;
  }

  negate() {
    if (/^-/.test(this.currentOperand)) {
      this.currentOperand = this.currentOperand.toString().match(/\d+\.?\d*/);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
  }

  compute() {
    if (/=$/.test(this.previousOperand)) {
      this.previousOperand = this.previousOperand.replace(/-?\d+\.?\d*/, this.currentOperand);
      this.currentOperand = this.operation(this.previousOperand.match(/-?\d+\.?\d*/), this.previousOperand.match(/-?\d+\.?\d*(?= =$)/));
    } else {
      this.previousOperand += ` ${this.currentOperand} =`;
      this.currentOperand = this.operation(this.previousOperand.match(/-?\d+\.?\d*/), this.currentOperand);
    }
  }

  updateDisplay() {
    this.previousOperandTextElement.innerText = this.previousOperand;
    this.currentOperandTextElement.innerText = this.currentOperand;
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const pointButton = document.querySelector('[data-point]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const negateButton = document.querySelector('[data-negate]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (/=/.test(calculator.previousOperand)) {
      calculator.clear();
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
  window.addEventListener('keydown', e => {
    console.log(e)
    if (e.key == button.innerText) {
      if (/=/.test(calculator.previousOperand)) {
        calculator.clear();
      }
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    }
  });
});

pointButton.addEventListener('click', () => {
  if (/=/.test(calculator.previousOperand)) {
    calculator.clear();
  }
  if (calculator.currentOperand == '') {
    calculator.appendNumber('0.');
  } else if (!/\./.test(calculator.currentOperand)) {
    calculator.appendNumber('.');
  }
  calculator.updateDisplay();
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (/[-+÷*]$/.test(calculator.previousOperand)) { //this block doesn't work for some reason?
      calculator.compute();
    }
    calculator.currentToPrevious();
    calculator.appendPrevious(` ${button.innerText}`);
    switch (button.innerText) {
      case '+':
        calculator.chooseOperation((a, b) => {
          return parseFloat(a) + parseFloat(b);
        });
        break;
      case '-':
        calculator.chooseOperation((a, b) => {
          return parseFloat(a) - parseFloat(b);
        });
          break;
      case '*':
        calculator.chooseOperation((a, b) => {
          return parseFloat(a) * parseFloat(b);
        });
          break;
      case '÷':
        calculator.chooseOperation((a, b) => {
          return parseFloat(a) / parseFloat(b);
        });
          break;
    }
    calculator.updateDisplay();
  })});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});
window.addEventListener('keydown', e => {
  console.log(e);
  if (e.key == '=' || e.key == 'Enter') {
    calculator.compute();
    calculator.updateDisplay();
  }
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});
window.addEventListener('keydown', e => {
  if (e.key == 'Backspace' || e.key == 'Delete') {
    calculator.delete();
    calculator.updateDisplay();
  }
});

negateButton.addEventListener('click', () => {
  calculator.negate();
  calculator.updateDisplay();
});