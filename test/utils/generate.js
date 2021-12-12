import faker from 'faker';

const buildUser = (overrides = {}) => {
  return {
    id: faker.datatype.number(),
    name: faker.internet.userName(),
    email: faker.internet.email(),
    role: 'admin',
    ...overrides,
  };
};

const buildReq = (overrides = {}) => {
  return {
    user: {},
    body: {},
    params: {},
    cookies: {},
    headers: {},
    header: jest.fn().mockName('header'),
    ...overrides,
  };
};

const buildRes = (overrides = {}) => {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  };
  return res;
};

const buildNext = (impl = () => {}) => {
  return jest.fn(impl).mockName('next');
};

export { buildReq, buildRes, buildNext, buildUser };
