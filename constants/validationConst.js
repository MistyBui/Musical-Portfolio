/* eslint-disable linebreak-style */
const registerConstraints = {
  username: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'not valid.',
    },
  },
  full_name: {
    presence: 'cannot be blank.',
  },
  password: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
  confirmPassword: {
    presence: 'cannot be blank.',
    equality: {
      attribute: 'password',
    },
  },
};

const uploadConstraints = {
  title: {
    presence: {
      message: 'Enter title.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  description: {
    format: {
      pattern: '^(.{3,})?$',
      flags: 'i',
      message: 'must be at least 3 characters',
    },
  },
};

const modifyConstraints = {
  email: {
    email: {
      message: 'not valid.',
    },
  },
  password: {
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
  confirmPassword: {
    equality: {
      attribute: 'password',
    },
  },
};

export {registerConstraints,
  uploadConstraints,
  modifyConstraints};
