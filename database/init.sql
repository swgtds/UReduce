CREATE TABLE IF NOT EXISTS urls (
  id TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_url TEXT NOT NULL,
  creation_date TIMESTAMP NOT NULL
);
