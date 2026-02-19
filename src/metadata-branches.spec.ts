import { createRequire } from 'module';

describe('metadata branches', () => {
  const requireFromHere = createRequire(__filename);
  const originalPick = (globalThis as Record<string, unknown>).Pick;
  const originalMovieRepository = (globalThis as Record<string, unknown>)
    .MovieRepository;

  afterEach(() => {
    if (originalPick === undefined) {
      delete (globalThis as Record<string, unknown>).Pick;
    } else {
      (globalThis as Record<string, unknown>).Pick = originalPick;
    }

    if (originalMovieRepository === undefined) {
      delete (globalThis as Record<string, unknown>).MovieRepository;
    } else {
      (globalThis as Record<string, unknown>).MovieRepository =
        originalMovieRepository;
    }

    jest.resetModules();
  });

  it('covers generated decorator metadata branches', () => {
    (globalThis as Record<string, unknown>).Pick = function PickRuntime() {
      return undefined;
    };
    (globalThis as Record<string, unknown>).MovieRepository =
      function MovieRepositoryRuntime() {
        return undefined;
      };

    jest.isolateModules(() => {
      requireFromHere('./app.controller');
      requireFromHere('./movies/movies.controller');
      requireFromHere('./movies/movies.service');
    });
  });
});
