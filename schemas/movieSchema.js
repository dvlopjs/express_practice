const { z } = require("zod");

const movieSchema = z.object({
  title: z.string({
    required_error: "Movie title required.",
  }),
  year: z.number().min(1900).max(2024),
  director: z.string(),
  poster: z.string(),
  rate: z.number().min(0).max(10),
});

const validateMovie = (object) => {
  return movieSchema.safeParse(object);
};

module.exports = {
  validateMovie,
};
