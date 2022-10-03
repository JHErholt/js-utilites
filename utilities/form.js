export class Form {
  static getData(selector = null) {
    if (selector == null || document.querySelector(selector) == null) return null;
    let form = new FormData(document.querySelector(selector));
    let data = {};
    for (var [key, value] of form) {
      switch (value) {
        case parseInt(value):
          data[key] = parseInt(value);
          break;
        case parseFloat(value):
          data[key] = parseFloat(value);
          break;
        case "on":
          data[key] = true;
          break;
        default:
          if (value == null) value = "";
          data[key] = value;
          break;
      }
    }
    return data;
  }

  static setData(selector, data) {
    //set data in form with object data
    let form = document.querySelector(selector);
    if (form == null) return;
    for (let key in data) {
      let input = form.querySelector(`[name=${key}]`);
      //get type of input
      if (input != null) {
        let type = input.getAttribute("type");
        if (type == null) {
          //check if input is a select
          if (input.tagName == "SELECT") {
            type = "select";
          }
        }
        switch (type) {
          case "checkbox":
          case "radio":
            input.checked = data[key];
            break;
          case "date":
            let date = new Date(data[key]);
            let result = date
              .toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .split("/")
              .reverse()
              .join("-");
            input.value = result;
            break;
          case "select":
            input.value = data[key];
            break;
          case "file":
            //do nothing
            break;
          default:
            input.value = data[key];
            break;
        }
      }
    }
  }

  static clear(selector, settings = { classNameError: "form__error", classNameValid: "form__valid" }) {
    let form = document.querySelector(selector);
    if (form == null) return;
    form.reset();

    //remove all error classes
    let inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      input.classList.remove(settings.classNameError);
      input.classList.remove(settings.classNameValid);
    });
  }

  static setValidate(form, settings = { classNameError: "form__error", classNameValid: "form__valid" }) {
    let inputs = form.querySelectorAll("input");

    //add event listeners to inputs on blur
    inputs.forEach((input) => {
      input.addEventListener("blur", (e) => {
        let valid = true;

        let type = e.srcElement.getAttribute("type");
        let value = e.srcElement.value;
        let regex = e.srcElement.getAttribute("regex");
        let required = e.srcElement.getAttribute("required");

        //check if input is required
        if (required != null && required == "true") {
          if (value == null || value == "") {
            valid = false;
          }
        }

        //check if input has regex
        if (regex != null) {
          let reg = new RegExp(regex);
          if (!reg.test(value)) {
            valid = false;
          }
        }

        switch (type) {
          case "number":
            if (isNaN(value)) {
              valid = false;
            }
            break;
          case "date":
            if (isNaN(Date.parse(value))) {
              valid = false;
            }
            break;
        }

        //get min and max if they exist
        let min = e.srcElement.getAttribute("min");
        let max = e.srcElement.getAttribute("max");
        if (min != null) {
          if (value < min) {
            valid = false;
          }
        }
        if (max != null) {
          if (value > max) {
            valid = false;
          }
        }

        //add error class to input
        if (!valid) {
          e.srcElement.classList.add(settings.classNameError);
          e.srcElement.classList.remove(settings.classNameValid);
        } else {
          e.srcElement.classList.remove(settings.classNameError);
          e.srcElement.classList.add(settings.classNameValid);
        }
      });
    });
  }

  static validate(form, settings = { classNameError: "form__error", classNameValid: "form__valid" }) {
    //get all inputs
    let inputs = form.querySelectorAll("input");
    let valid = true;

    //loop through all inputs
    inputs.forEach((input) => {
      //trigger blur event
      input.dispatchEvent(new Event("blur"));
    });

    //check if any inputs are invalid
    inputs.forEach((input) => {
      if (input.classList.contains(settings.classNameError)) {
        valid = false;
      }
    });

    return valid;
  }
}
