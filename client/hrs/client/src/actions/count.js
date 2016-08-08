const increase = (n) => {
  return {
    type: 'INCREASE',
    amount: n
  };
}

const decrease = (n) => {
  return {
    type: 'DECREASE',
    amount: n
  };
}

export { increase, decrease };
