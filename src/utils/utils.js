export const firstLetterUppercase = (e) => {
  e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
};

export const allLettersUppercase = (e) => {
  e.target.value = e.target.value.toUpperCase().trim();
};

export const allLettersLowercase = (e) => {
  e.target.value = e.target.value?.toLowerCase().trim();
};

export const allLettersCapitalize = (e) => {
  e.target.value = e.target.value?.toLowerCase().trim();
  e.target.value = e.target.value.replace(/\b\w/g, (l) => l.toUpperCase());
};

export const specialCharactersNotAllowed = (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
};

export const onlyNumbersAllowed = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
};
