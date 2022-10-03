export class Ele {
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
    switch (typeof n) {
      case "string":
      case "number":
        el.appendChild(document.createTextNode(n));
        break;
      case "object":
        //check if the object is an array or not
        for (let i = 0; i < n.length; i++) {
          if (n[i] instanceof Array) {
            for (let j = 0; j < n[i].length; j++) {
              if (n[i][j] != null) {
                el.appendChild(n[i][j]);
              }
            }
          }
          else {
            if (n[i] != null) {
              el.appendChild(n[i]);
            }
          }
        }
        break;
      default:
        el.appendChild(n);
        break;
    }
    return el;
  }
}
