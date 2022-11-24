
module.exports = {
  server: {
    port: 9000
  },

  database: {
    url: `mongodb://${process.env.db_user}:${process.env.db_pwd}@ec2-54-165-0-20.compute-1.amazonaws.com/${process.env.db_name}`
  },

  regex: {
    email: /^[^\W_]+\w*(?:[.-]\w*)*[^\W_]+@[^\W_]+(?:[.-]?\w*[^\W_]+)*(?:\.[^\W_]{2,})$/,
    password_pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  },

  email :{
    host: "smtp.gmail.com",
    port: 587,
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    },
    auth: {
        user: process.env.email_user,
        pass: process.env.email_pass
    }
  }
};
