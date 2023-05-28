import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from './logger.service';
import { Request } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let loggerService: LoggerService;
  let mockLoggerService: Partial<LoggerService>;
  let mockRequest: Partial<Request>;
  let mockResponse;
  let mockNextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      url: '/test',
    };

    mockResponse = {};

    mockNextFunction = jest.fn();

    loggerService = new LoggerService(mockRequest as Request); // Inject the mock request object
    middleware = new LoggerMiddleware(loggerService);
  });

  it('should log incoming request', () => {
    const spy = jest.spyOn(loggerService, 'log').mockImplementation(() => {
      //logging here.
    });
    middleware.use(mockRequest as Request, mockResponse, mockNextFunction);

    expect(spy).toHaveBeenCalledWith('Incoming Request', {
      body: undefined,
      headers: undefined,
      queries: undefined,
      params: undefined,
    });
  });

  it('should call next function', () => {
    middleware.use(mockRequest as Request, mockResponse, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalled();
  });
});
