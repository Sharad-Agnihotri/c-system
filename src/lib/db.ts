// This file is now a stub since authentication is bypassed.
export async function initDB() {
  console.log("Database initialization skipped (auth bypassed)");
  return Promise.resolve();
}

export const sql = () => {
  console.warn("SQL called while auth bypassed.");
  return Promise.resolve({ rows: [] });
};
