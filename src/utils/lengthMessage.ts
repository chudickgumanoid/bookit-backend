export const messageMinText = (min: number) => {
  if (min) {
    return { message: `Min length ${min} symbols` };
  }
};

export const messageMaxText = (max: number) => {
  if (max) {
    return { message: `Max length ${max} symbols` };
  }
};
