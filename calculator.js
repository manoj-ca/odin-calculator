
const max = 9; // max display characters
const maxPos = 99999999;
const maxNeg = -9999999;
const operRE = /[-\+\*\/]/;
const dotRE = /[.]/;

const oper = {
  NONE: '',
  ADD: '+',
  SUB: '-',
  MULT: '*',
  DIV: '/'
}

let done = false;
let operator = oper.NONE;

const display = document.querySelector(".display");
display.textContent = '0';

function getOper(key) {
  if (key == '+') {
    return oper.ADD;
  } else if (key == '-') {
    return oper.SUB;
  } else if (key == '*') {
    return oper.MULT;
  } else if (key == '/') {
    return oper.DIV;
  } else {
    return oper.NONE;
  }
}

function add(a, b) {
  return Number(a) + Number(b);
}

function sub(a, b) {
  return Number(a) - Number(b);
}

function mult(a, b) {
  return Number(a) * Number(b);
}

function div(a, b) {
  return Number(a) / Number(b);
}

function operate(a, b, o) {
  let ans = 0;
  switch (o) {
    case oper.ADD:
      ans = add(a, b);
      break;
    case oper.SUB:
      ans = sub(a, b);
      break;
    case oper.MULT:
      ans = mult(a, b);
      break;
    case oper.DIV:
      ans = div(a, b);
      break;
    default:
      console.error('invalid operation');
      break;
  }
  const ansStr = ans.toString();
  if (ansStr.length < max) {
    return ansStr;
  } else if (ans > maxPos || ans < maxNeg) {
    return "Too Large";
  } else if (ansStr.match(dotRE) != null) {
    const arr = ansStr.split('.');
    const fixed = max - (arr[0].length + 5);
    if (fixed > 0) {
      return ans.toFixed(fixed);
    } else {
      return Math.round(ans);
    }
  } else {
    return "Unknown";
  }
}

function keyPress(key) {
  if (key == 'Clr') {
    done = false;
    operator = oper.NONE;
    display.textContent = '0';
  } else if (key == 'Del') {
    done = false;
    const len = display.textContent.length;
    if (len > 1) {
      const found = display.textContent.charAt(len - 1).match(operRE);
      if (found != null) operator = oper.NONE;
      let str = display.textContent.slice(0, -1);
      display.textContent = str;
    } else {
      display.textContent = '0';
    }
  } else if (key.match(operRE) != null || key == '=') {
    done = false;
    if (operator == oper.NONE) {
      if (display.textContent.length >= max || key == '=') return;
      operator = getOper(key);
      display.textContent += key;
    } else {
      const arr = display.textContent.split(operator);
      if (arr.length < 2 || arr[0].length < 1 || arr[1].length < 1) return;
      display.textContent = operate(arr[0], arr[1], operator);
      operator = getOper(key);
      if (display.textContent.length < max && key != '=') {
        display.textContent += key;
      }
      if (key == '=') done = true;
    }
  } else if (key == '.') {
    if (done) {
      done = false;
      display.textContent = '0.';
      return;
    }
    let text = display.textContent;
    if (operator != oper.NONE) {
      const arr = text.split(operator);
      text = arr[1];
    }
    if (text.match(dotRE) != null) return;
    display.textContent += key;
  } else if (display.textContent == '0') {
    display.textContent = key;
  } else if (display.textContent.length < max) {
    if (done) {
      done = false;
      display.textContent = key;
    } else {
      display.textContent += key;
    }
  }
}

document.addEventListener('keydown', function (event) {
  let key = event.key;
  if (key == 'Enter') key = '=';
  const numKey = key >= 0 && key <= 9 || key == '.';
  const operKey = key.match(operRE) != null || key == '=';
  if (numKey || operKey) {
    keyPress(key);
  } else if (key == 'Backspace') {
    keyPress('Clr');
  } else if (key == 'Delete') {
    keyPress('Del');
  }
});
