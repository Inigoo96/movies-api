import { createRequire } from 'module';

describe('main bootstrap', () => {
  const requireFromHere = createRequire(__filename);
  const originalPort = process.env.PORT;

  afterEach(() => {
    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }

    jest.resetModules();
    jest.clearAllMocks();
  });

  const runMain = async (port?: string) => {
    if (port === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = port;
    }

    const listen = jest.fn().mockResolvedValue(undefined);
    const appMock = { listen };
    const create = jest.fn().mockResolvedValue(appMock);
    const createDocument = jest.fn().mockReturnValue({});
    const setup = jest.fn();
    const builder = {
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({ title: 'Movies API' }),
    };

    jest.isolateModules(() => {
      jest.doMock('@nestjs/core', () => ({
        NestFactory: { create },
      }));
      jest.doMock('./app.module', () => ({
        AppModule: class AppModule {},
      }));
      jest.doMock('@nestjs/swagger/dist/swagger-module', () => ({
        SwaggerModule: { createDocument, setup },
      }));
      jest.doMock('@nestjs/swagger/dist/document-builder', () => ({
        DocumentBuilder: jest.fn().mockImplementation(() => builder),
      }));

      requireFromHere('./main');
    });

    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });

    return { listen, create, createDocument, setup, builder };
  };

  it('usa PORT cuando está definido', async () => {
    const mocks = await runMain('4321');

    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.builder.setTitle).toHaveBeenCalledWith('Movies API');
    expect(mocks.builder.setDescription).toHaveBeenCalledWith(
      'API de ejemplo: listado de películas',
    );
    expect(mocks.builder.setVersion).toHaveBeenCalledWith('1.0.0');
    expect(mocks.createDocument).toHaveBeenCalledTimes(1);
    expect(mocks.setup).toHaveBeenCalledTimes(1);
    expect(mocks.listen).toHaveBeenCalledWith('4321');
  });

  it('usa 3000 por defecto cuando PORT no está definido', async () => {
    const mocks = await runMain();

    expect(mocks.listen).toHaveBeenCalledWith(3000);
  });
});
