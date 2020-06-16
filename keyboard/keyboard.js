const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
      "alt", "space"
    ];
const keyLayoutKor = {
  "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
  "6": "^", "7": "&", "8": "*", "9": "(", "0": ")",
  "q": "ㅂ", "w": "ㅈ", "e": "ㄷ", "r": "ㄱ",
  "t": "ㅅ", "y": "ㅛ", "u": "ㅕ", "i": "ㅑ",
  "o": "ㅐ", "p": "ㅔ", "a": "ㅁ", "s": "ㄴ",
  "d": "ㅇ", "f": "ㄹ", "g": "ㅎ", "h": "ㅗ",
  "j": "ㅓ", "k": "ㅏ", "l": "ㅣ", "z": "ㅋ",
  "x": "ㅌ", "c": "ㅊ", "v": "ㅍ", "b": "ㅠ",
  "n": "ㅜ", "m": "ㅡ", ",": "<", ".":">", "/": "?"
};

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },
  properties: {
    value: "",
    eng:true,
    capsLock: false,
  },
  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add("keyboard", 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard_keys');
    this.elements.keysContainer.appendChild(this._createKeys());
    
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');
    
    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
    
    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach(element => {
      element.addEventListener('focus', () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
      element.addEventListener('keyup', () => {
        this.properties.value = element.value;
      });
    });
  },

  _createKeys(){
    const fragment = document.createDocumentFragment();
    
    // Create HTML fo an icon
    const createIconHTML = (icon_name) => {
      return `<i class='material-icons'>${icon_name}</i>`;
    };
    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'p', 'enter', '/'].indexOf(key) !== -1;
      
      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard_key');
      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard_key--wide');
          keyElement.innerHTML = createIconHTML('backspace');
          
          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent('oninput');
          });
          
          break;
        case 'caps':
          keyElement.classList.add('keyboard_key--wide', 'keyboard_key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');
          
          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard_key--active', this.properties.capsLock);
          });
          
          break;
        case 'enter':
          keyElement.classList.add('keyboard_key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');
          
          keyElement.addEventListener('click', () => {
            this.properties.value += "\n";
            this._triggerEvent('oninput');
          });
          
          break;
        case 'space':
          keyElement.classList.add('keyboard_key--extra--wide');
          keyElement.innerHTML = createIconHTML('space_bar');
          
          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });
          
          break;
        case 'done':
          keyElement.classList.add('keyboard_key--wide', "keyboard_key--dark");
          keyElement.innerHTML = createIconHTML('check_circle');
          
          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });
          
          break;
        case 'alt':
          keyElement.innerHTML = createIconHTML('chevron_right');
          
          keyElement.addEventListener('click', () => {
            this._toggleButton();
            this._triggerEvent('oninput');
          });
          break;
        
        default:
          keyElement.textContent = key.toLowerCase();
          
          keyElement.addEventListener('click', () => {
            if(this.properties.eng)
              this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            else {
              this.properties.value += keyElement.textContent;
            }
            
            this._triggerEvent('oninput');
          });
          
          break;
      }
      
      fragment.appendChild(keyElement);
      
      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    
    return fragment;
  },

  _triggerEvent(handlerName) {    
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },
  
  // toggle eng to kor, num to special character
  _toggleButton() {
    if (this.properties.eng) {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = keyLayoutKor[key.textContent];
        }
      }
    } else {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          let engTxt = Object.keys(keyLayoutKor).find(layoutKey =>
            keyLayoutKor[layoutKey] === key.textContent);
          if (engTxt) {
            key.textContent = engTxt;
          }
        }
      }
    }
    this.properties.eng = !this.properties.eng;
  },
  
  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden')
  },

  close(){
    this.properties.value = "";
    if (!this.properties.eng) this._toggleButton();
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
