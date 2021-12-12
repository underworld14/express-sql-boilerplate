import HttpException from 'exceptions/HttpException';

test('Http exeception should instance of Error', () => {
  const error = new HttpException(500, 'server error');
  expect(error).toBeInstanceOf(Error);
});

test('Http exeception should provide status, message, & stack trace', () => {
  const code = 500;
  const message = 'server error';

  const error = new HttpException(code, message);
  expect(error.status).toEqual(code);
  expect(error.message).toEqual(message);
  expect(error.stack).toMatchInlineSnapshot(`
"Error: server error
    at Object.<anonymous> (/home/underworld/projects/inventory-app/inventorybe/app/exceptions/__tests__/HttpException.test.js:12:17)
    at Promise.then.completed (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/utils.js:390:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/utils.js:315:10)
    at _callCircusTest (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:218:40)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at _runTest (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:155:3)
    at _runTestsForDescribeBlock (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:66:9)
    at run (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/run.js:25:3)
    at runAndTransformResultsToJestFormat (/home/underworld/projects/inventory-app/inventorybe/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:166:21)"
`);
});
