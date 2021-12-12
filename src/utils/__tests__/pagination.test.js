import * as pagination from 'utils/pagination';

test('getPagination should get paginated data', () => {
  const page = 1;
  const limit = 15;

  const paginated = pagination.getPagination(page, limit);

  expect(paginated.limit).toEqual(limit);
  expect(paginated.offset).toEqual(page * limit);
});

test('getPagination should get default paginated data', () => {
  const paginated = pagination.getPagination();

  expect(paginated.limit).toEqual(25);
  expect(paginated.offset).toEqual(0);
});

test('getPagingData should convert data from database to paginated result (default)', () => {
  const data = { count: 0, rows: [] };
  const pagingData = pagination.getPagingData(data);

  expect(pagingData.items).toEqual(data.rows);
  expect(pagingData.pagination).toEqual({
    totalItems: data.count,
    currentPage: 1,
    totalPages: 1,
  });
});

test('getPagingData should convert data from database to paginated result, (2)', () => {
  const page = 2;
  const limit = 25;
  const data = { count: 100, rows: [] };

  const pagingData = pagination.getPagingData(data, page, limit);

  expect(pagingData.items).toEqual(data.rows);
  expect(pagingData.pagination).toEqual({
    totalItems: data.count,
    currentPage: 2,
    totalPages: 4,
  });
});
