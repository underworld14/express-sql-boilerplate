import catchAsync from 'exceptions/catchAsync';
import HttpException from 'exceptions/HttpException';
import * as generate from 'utils/generate';

test('catchAsync should throw an unexpected error', async () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  const error = new Error('Iam an error');

  const asyncFunction = jest.fn(async () => {
    throw error;
  });

  await catchAsync(asyncFunction)(req, res, next);
  expect(asyncFunction).toHaveBeenCalled();
  expect(next).toHaveBeenCalledWith(error);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});

test('catchAsync should throw an HttpExeception error', async () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  const error = new HttpException(404, 'items not found');

  const asyncFunction = jest.fn(async () => {
    throw error;
  });

  await catchAsync(asyncFunction)(req, res, next);
  expect(asyncFunction).toHaveBeenCalled();
  expect(next).toHaveBeenCalledWith(error);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});
