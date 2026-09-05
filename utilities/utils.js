function roundTo(num, digit) {
  return Math.floor(num * 10 ** digit) / 10 ** digit;
}

export { roundTo };
