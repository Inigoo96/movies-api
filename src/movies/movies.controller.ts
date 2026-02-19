import { Controller, Get, Inject } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';

@ApiTags('movies')
@Controller('api/movies')
export class MoviesController {
  constructor(
    @Inject(MoviesService)
    private readonly moviesService: Pick<MoviesService, 'listMovies'>,
  ) {}

  @Get()
  @ApiOkResponse({ type: CreateMovieDto, isArray: true })
  async getMovies() {
    return this.moviesService.listMovies();
  }

  @Get('error')
  getMoviesWithError() {
    return [{ name: 'Error intencionado' }];
  }
}
