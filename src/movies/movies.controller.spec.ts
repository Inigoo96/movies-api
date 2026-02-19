import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  const moviesServiceMock = {
    listMovies: jest.fn<Promise<Movie[]>, []>(),
  };

  beforeEach(async () => {
    moviesServiceMock.listMovies.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: moviesServiceMock }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getMovies() devuelve películas del servicio', async () => {
    const movies: Movie[] = [
      { id: 1, title: 'Coco' } as Movie,
      { id: 2, title: 'Toy Story' } as Movie,
    ];
    moviesServiceMock.listMovies.mockResolvedValue(movies);

    await expect(controller.getMovies()).resolves.toEqual(movies);
    expect(moviesServiceMock.listMovies).toHaveBeenCalledTimes(1);
  });

  it('getMoviesWithError() devuelve payload esperado', () => {
    expect(controller.getMoviesWithError()).toEqual([
      { name: 'Error intencionado' },
    ]);
  });
});
