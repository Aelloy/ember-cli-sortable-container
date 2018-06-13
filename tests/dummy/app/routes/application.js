import Route from '@ember/routing/route';
import { A } from '@ember/array';
import Author from 'dummy/models/author';

export default Route.extend({
  model() {
    const authors = [
      "Leo Tolstoy", "Theodor Dostoevsky", "Alexander Pushkin",
      "Anton Tchechov", "Nikolai Gogol", "Ivan Bunin"
    ].map((name) => Author.create({name}));
    return A(authors);
  }
});
