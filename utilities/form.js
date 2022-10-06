export default class Form {
  static getData(selector = null) {
    if (selector == null || document.querySelector(selector) == null) {
      throw new Error("Form not found");
    }
    let form = document.querySelector(selector);
    let data = {};
    let elements = [];

    elements = elements.concat(Array.from(form.querySelectorAll("input")));
    elements = elements.concat(Array.from(form.querySelectorAll("select")));
    elements = elements.concat(Array.from(form.querySelectorAll("textarea")));
    elements.forEach((ele) => {
      if (ele.name === null || ele.name === "") {
        throw new Error("Input name is null");
      }
      let date = Form.#convertData(ele);
      if (date != null) {
        data[ele.name] = Form.#convertData(ele);
      }
    });
    return data;
  }

  static #convertData(input) {
    let type = input.getAttribute("type");
    let value = input.value;
    switch (type) {
      case "number":
        return Number(value);
      case "checkbox":
        if (input.checked) {
          return input.value;
        }
        break;
      case "radio":
        if (input.checked) {
          return value;
        }
        break;
      case "date":
        let date = new Date(value);
        if (date.getUTCHours() == 0 && date.getUTCMinutes() == 0 && date.getUTCSeconds() == 0) {
          return date.toISOString().split("T")[0];
        }
        return new Date(value).toISOString();
      case "hidden":
        if (!isNaN(value)) {
          return Number(value);
        }
        return value;
      default:
        return value;
    }
  }

  static setData(selector, data) {
    if (selector == null || document.querySelector(selector) == null) {
      throw new Error("Form not found");
    }
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
            input.checked = data[key];
            break;
          case "radio":
            //get all radio buttons with same name
            let radios = form.querySelectorAll(`[name=${key}]`);
            radios.forEach((radio) => {
              if (radio.value == data[key]) {
                radio.checked = true;
              }
            });
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
}
