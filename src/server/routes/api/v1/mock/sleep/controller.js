const sleep = (req, res) => {
  const { ms } = req.params;

  setTimeout(() => {
    res.sendStatus(200);
  }, ms);
};

export { sleep };
