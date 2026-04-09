const example = {
  size: 3,
  cursor: validated.values[1],
  values: new Map([
    [
      '019d71d7-cbe5-7495-aee8-9694273d2306',
      {
        uuidv7: '019d71d7-cbe5-7495-aee8-9694273d2306',
        value: 'What is',
        predecessor: '\0',
        index: 0,
        prev: undefined,
        next: validated.values[0],
      },
    ],
    [
      '019d71d7-cbe5-7495-aee8-8e2721f7cd22',
      {
        uuidv7: '019d71d7-cbe5-7495-aee8-8e2721f7cd22',
        value: 'up',
        predecessor: '019d71d7-cbe4-746c-a5ac-8c2743c46e64',
        index: 1,
        prev: validated.values[2],
        next: validated.values[1],
      },
    ],
    [
      '019d71d7-cbe5-7495-aee8-92abf1b562ac',
      {
        uuidv7: '019d71d7-cbe5-7495-aee8-92abf1b562ac',
        value: 'dude!',
        predecessor: '019d71d7-cbe5-7495-aee8-8e2721f7cd22',
        index: 2,
        prev: validated.values[0],
        next: undefined,
      },
    ],
  ]),
  tombstones: new Set(['019d71d7-cbe4-746c-a5ac-8c2743c46e64']),
}
