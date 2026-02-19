import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

type MovieRepository = Pick<Repository<Movie>, 'find'>;

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: MovieRepository,
  ) {}

  async listMovies(): Promise<Movie[]> {
    return this.movieRepo.find({ order: { id: 'ASC' } });
  }
  /*async listMovies(): Promise<Movie[]> {
   const movies = await this.movieRepo.find();
   return movies.map((m) => ({ ...m, title: m.title.toUpperCase() }));
 }*/

  /*async listMovies(): Promise<Movie[]> {
   return 'hola' a s any;
 }*/
}
