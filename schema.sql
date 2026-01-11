-- 1. Create the table
CREATE TABLE IF NOT EXISTS cases (
  slug TEXT PRIMARY KEY,       -- e.g., "dominique-pelicot"
  title TEXT,                  -- e.g., "The Pelicot Affair"
  case_id TEXT,                -- e.g., "001-DP-FR"
  image_url TEXT,              -- e.g., "/images/dominique-1.jpg"
  summary TEXT,                -- Short description for previews
  html_content TEXT            -- The full article body HTML
);

-- 2. Insert the Pelicot Case (Example Data)
INSERT OR IGNORE INTO cases (slug, title, case_id, image_url, summary, html_content) 
VALUES (
  'dominique-pelicot', 
  'The Pelicot Affair', 
  '001-DP-FR', 
  '/images/dominique-1.jpg',
  'An in-depth examination of Dominique Pelicot...', 
  '
    <p>For nearly 50 years, Gisèle Pelicot lived a life she believed was built on love and trust...</p>
    <h2>I. The Discovery</h2>
    <p>The decade of systematic abuse was not uncovered by a victim complaint...</p>
  '
);