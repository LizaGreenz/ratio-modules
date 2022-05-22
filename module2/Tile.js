export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;
  query;

  constructor(tileContainer, value = Math.random() > 0.1 ? 1024 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    this.query = window.matchMedia("(max-width: 550px)");

    switch (v) {
      case Math.pow(2, 1):
        this.#tileElement.style.setProperty("background", "#eee4da");
        break;
      case Math.pow(2, 2):
        this.#tileElement.style.setProperty("background", "#ede0c8");
        break;
      case Math.pow(2, 3):
        this.#tileElement.style.setProperty("background", "#f2b179");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 4):
        this.#tileElement.style.setProperty("background", "#f59563");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 5):
        this.#tileElement.style.setProperty("background", "#f67c5f");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 6):
        this.#tileElement.style.setProperty("background", "#f65e3");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 7):
        this.#tileElement.style.setProperty("background", "#edcf73");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 8):
        this.#tileElement.style.setProperty("background", "#edcc62");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 9):
        this.#tileElement.style.setProperty("background", "#edc850");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        break;
      case Math.pow(2, 10):
        this.#tileElement.style.setProperty("background", "#edc53f");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        if (this.query.matches) {
          this.#tileElement.style.setProperty("font-size", "calc(3rem / 1.7)");
        } else {
          this.#tileElement.style.setProperty("font-size", "3rem");
        }
        this.query.onchange = (e) => {
          if (e.matches) {
            this.#tileElement.style.setProperty(
              "font-size",
              "calc(3rem / 1.7)"
            );
          } else {
            this.#tileElement.style.setProperty("font-size", "3rem");
          }
        };
        break;
      case Math.pow(2, 11):
        this.#tileElement.style.setProperty("background", "#edc22d");
        this.#tileElement.style.setProperty("color", "#f9f6f2");
        this.#tileElement.style.setProperty("font-size", "3.8rem");
        if (this.query.matches) {
          this.#tileElement.style.setProperty("font-size", "calc(3rem / 1.7)");
        } else {
          this.#tileElement.style.setProperty("font-size", "3rem");
        }
        this.query.onchange = (e) => {
          if (e.matches) {
            this.#tileElement.style.setProperty(
              "font-size",
              "calc(3rem / 1.7)"
            );
          } else {
            this.#tileElement.style.setProperty("font-size", "3rem");
          }
        };
        break;
    }
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      );
    });
  }
}
