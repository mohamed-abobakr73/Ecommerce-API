const snakeToCamel = (str) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word, index) => {
      if (index === 0) return word;
      return word[0].toUpperCase() + word.slice(1);
    })
    .join("");
};

export default snakeToCamel;
