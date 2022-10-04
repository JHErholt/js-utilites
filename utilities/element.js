export default class Ele {
  static make(tagName, props, nest) {
    let el = document.createElement(tagName);
    if (props) {
      for (let name in props) {
        if (name.indexOf("on") === 0) {
          el.addEventListener(name.substring(2).toLowerCase(), props[name], false);
        } else if (typeof props[name] === "function") {
          if (name == "function") {
            if (props[name].call() != "") {
              el.setAttribute(props[name].call(), "");
            }
          } else {
            el.setAttribute(name, props[name].call());
          }
        } else {
          ;
          el.setAttribute(name, props[name]);
        }
      }
    }
    if (nest == null) {
      return el;
    } else if (nest instanceof Function) {
      return Ele.#nester(el, nest.call());
    } else {
      return Ele.#nester(el, nest);
    }
  }

  static #nester(el, n) {
    if (n instanceof Array) {
      n.forEach((element) => {
        if (n instanceof Array) {
          Ele.#nester(el, element)
        }
        else {
          el.appendChild(element);
        }
      });
    } else if (n instanceof Object) {
      el.appendChild(n);
    }
    else {
      el.appendChild(document.createTextNode(n));
    }
    return el;
  }
}
