function roundTo(num, digit) {
  return Math.floor(num * 10 ** digit) / 10 ** digit;
}

function clamp(min, pref, max) {
  return Math.max(min, Math.min(pref, max));
}

function toRad(degree) {
  return (degree * Math.PI) / 180;
}

function toDegrees(rad) {
  return (rad * 180) / Math.PI;
}

function calcDistance2Points(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function indentText(text, newLine) {
  let ctr = 0;
  let newText = [];
  for (const letter of text) {
    if (ctr >= newLine) {
      newText.push("\n");
      ctr = 0;
    }
    newText.push(letter);
    ctr++;
  }
  return newText.join("");
}

function colorToRGB(color) {
  const tempEl = document.createElement("div");
  tempEl.style.color = color;
  document.body.appendChild(tempEl);

  const colorCode = window.getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  const zero = 0;
  const rgbValues = colorCode.match(/\d+/g);
  if (!rgbValues) return { zero, zero, zero };

  const r = parseInt(rgbValues[0]);
  const g = parseInt(rgbValues[1]);
  const b = parseInt(rgbValues[2]);

  return { r, g, b };
}

export { roundTo, clamp, colorToRGB, indentText, calcDistance2Points };
