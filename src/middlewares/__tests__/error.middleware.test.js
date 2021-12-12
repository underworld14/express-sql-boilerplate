import HttpException from 'exceptions/HttpException';
import errorMiddleware from 'middlewares/error.middleware';
import * as generate from 'utils/generate';

test('errorMiddleware should parse error outside HttpException', () => {
  const error = new Error('this is an server error');
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  errorMiddleware(error, req, res, next);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  Object {
    "code": 500,
    "message": "this is an server error",
    "stack": "Error: this is an server error
    at errorMiddleware (/home/underworld/projects/inventory-app/inventorybe/app/middlewares/error.middleware.js:8:13)
    at Object.<anonymous> (/home/underworld/projects/inventory-app/inventorybe/app/middlewares/__tests__/error.middleware.test.js:11:3)
    at Promise.then.completed (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/utils.js:390:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/utils.js:315:10)
    at _callCircusTest (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:218:40)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at _runTest (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:66:9)
    at run (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:25:3)",
  },
]
`);
  expect(res.json).toHaveBeenCalledTimes(1);
});

test('errorMiddleware should return error to the user', () => {
  const error = new HttpException(404, 'item not found');
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  errorMiddleware(error, req, res, next);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  Object {
    "code": 404,
    "message": "item not found",
    "stack": "Error: item not found
    at Object.<anonymous> (/home/underworld/projects/inventory-app/inventorybe/app/middlewares/__tests__/error.middleware.test.js:37:17)
    at Promise.then.completed (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/utils.js:390:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/utils.js:315:10)
    at _callCircusTest (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:218:40)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at _runTest (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:66:9)
    at run (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:166:21)",
  },
]
`);
  expect(res.json).toHaveBeenCalledTimes(1);
});

test('errorMiddleware should not return stack error on production environment', () => {
  const error = new HttpException(404, 'item not found');
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();
  process.env.NODE_ENV = 'production';

  errorMiddleware(error, req, res, next);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith({
    code: 404,
    message: 'item not found',
  });
  expect(res.json).toHaveBeenCalledTimes(1);
  process.env.NODE_ENV = 'test';
});
