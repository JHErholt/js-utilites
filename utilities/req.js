export default class Req {
  static async do(
    url,
    { method = "GET", body = null, headers = { "Content-Type": "application/json;" }, responseType = "json" } = {},
    { before = null, success = null, error = null, after = null } = {}
  ) {
    if (before != null) before();
    if (url.startsWith("/")) {
      url = window.location.origin + url;
    }
    if (body !== null) {
      if (headers["Content-Type"].includes("application/json")) {
        body = JSON.stringify(body);
      } else {
        let formData = new FormData();
        for (const [key, value] of Object.entries(body)) {
          if (Array.isArray(value)) {
            for (var i in value) {
              if (value[i] === Object(value[i])) {
                for (var [objKey, objValue] of Object.entries(value[i])) {
                  formData.append(`${key}[${i}][${objKey}]`, objValue);
                }
              } else {
                formData.append(`${key}[${i}]`, value[i]);
              }
            }
          } else {
            formData.append(key, value);
          }
        }
        body = formData;
      }
    }
    let response = await fetch(url, { method, body, headers, responseType });
    let data;

    if (response.ok) {
      let callSuccess = false;
      let type = response.headers.get("Content-Type");
      switch (type) {
        case "application/json":
        case "application/json; charset=utf-8":
          data = await response.json();
          if ("successfully" in data && !data.successfully) {
            callSuccess = false;
          } else {
            callSuccess = true;
          }
          break;
        case "application/octet-stream":
        case "application/pdf":
          data = await response.blob();
          callSuccess = true;
          break;
        default:
          try {
            data = await response.json();
            if ("successfully" in data && !data.successfully) {
              callSuccess = false;
            } else {
              callSuccess = true;
            }
          } catch (e) {
            console.log(e, response);
            if (response.redirected) {
              data = "request redirected to " + response.url;
              callSuccess = false;
            } else {
              data = await response.text();
              callSuccess = true;
            }
          }

          break;
      }
      if (callSuccess) {
        if (success != null) success(data);
      } else {
        if (error != null) error(data);
      }
    } else {
      error(await response);
    }
    if (after) after(data);
  }
}
