export const addMessage = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?);`;
export const subscribe = `INSERT INTO subscribers (email) VALUES (?);`;
export const getSubscribers = `select * from subscribers;`;
export const getSubscriberCount = `SELECT COUNT(*) AS subscribers FROM subscribers WHERE email = ?;`;