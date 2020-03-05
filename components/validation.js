const validation = {

    username: {
        presence: {
            message: '^Please enter an username'
        },length: {
            minimum: 3,
            message: '^Your username must be at least 3 characters'
          }

    },

    password: {
        presence: {
          message: '^Please enter a password'
        },
        length: {
          minimum: 5,
          message: '^Your password must be at least 5 characters'
        }
      },

    email: {
      presence: {
        message: '^Please enter an email address'
      },
      email: {
        message: '^Please enter a valid email address'
      }
    },
    
    title: { 
      presence: {
        message: '^Please enter a title'
      },
      length: {
        minimum: 3,
        message: '^must be at least 3 characters'
      }
    }
    
  }
  
  export default validation;