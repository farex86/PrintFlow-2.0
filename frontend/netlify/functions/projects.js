import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const projects = await sql`SELECT * FROM projects`;
      return { statusCode: 200, headers, body: JSON.stringify(projects) };
    }

    if (event.httpMethod === 'POST') {
      const { name, description, client_id, status, priority, category, deadline, budget_amount, budget_currency, progress } = JSON.parse(event.body);

      const result = await sql`
        INSERT INTO projects (name, description, client_id, status, priority, category, deadline, budget_amount, budget_currency, progress)
        VALUES (${name}, ${description}, ${client_id}, ${status}, ${priority}, ${category}, ${deadline}, ${budget_amount}, ${budget_currency}, ${progress})
        RETURNING *
      `;

      return { statusCode: 201, headers, body: JSON.stringify(result[0]) };
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
