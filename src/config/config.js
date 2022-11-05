
module.exports = {
  server: {
    port: 9000
  },
  database: {
    url: `mongodb://${process.env.db_user}:${process.env.db_pwd}@ec2-54-165-0-20.compute-1.amazonaws.com/recipe_test`
  }
};
