import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'POST') {
      const { email, password } = JSON.parse(event.body);

      // Simple user verification
      const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

      if (users.length === 0) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid user' }) };
      }

      // TODO: Validate password (hash check)

      // Return dummy token and user data
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token: 'dummy_token',
          user: users[0],
        }),
      };
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
