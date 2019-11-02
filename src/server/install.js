import User from "./models/user";

// create sample admin user
User.findOne({ username: "test" }, (err, doc) => {
  if (err) {
    return console.error(err);
  } else if (doc) {
    return;
  }

  const user = new User({
    role: "admin",
    type: "basic",
    username: "test",
  });
  user.password = user.generatePasswordHash("test");

  user.save(error => {
    if (error) {
      console.error(error);
    }
  });
});
