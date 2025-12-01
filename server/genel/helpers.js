export function calc(value) {
  return value + 7;
}
export function list(value, name, options) {
  return (
    "<h3>" +
    options.fn({ test: value, test1: name, label: "custom Helper List" })
  );
}

export function DigitFract(value,fractDigit) {
  return value.toFixed(fractDigit)
}

export function IsEq(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}
export function BiggerThan(v1, options) {
  if (v1.length > 0) {
    return options.fn(this);
  }
  return options.inverse(this);
}
export function LessThan(v1, options) {
  if (v1.length <= 0) {
    return options.fn(this);
  }
  return options.inverse(this);
}
export function Inc(v1, options) {
  return parseInt(v1) + 1;
}
export function Json(v1,options){
  return JSON.stringify(v1);
}