export default body => {
  const find = body.find || {};
  const limit = body.limit || null;
  const sort = body.sort || {};

  return {
    find,
    limit,
    sort,
  };
};
