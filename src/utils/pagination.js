export const getPagination = (page = 1, limit) => {
  limit = limit ? +limit : 25;
  const offset = (page - 1) * limit;

  return { limit, offset };
};

export const getPagingData = (data, page = 1, limit = 25) => {
  const { count: totalItems, rows: items } = data;
  const totalPages = totalItems ? Math.ceil(totalItems / +limit) : 1;

  return {
    items,
    pagination: {
      totalItems,
      currentPage: +page,
      totalPages,
    },
  };
};
