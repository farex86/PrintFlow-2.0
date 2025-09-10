import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const tasks = await sql`SELECT * FROM tasks`;
      return { statusCode: 200, headers, body: JSON.stringify(tasks) };
    }

    if (event.httpMethod === 'POST') {
      const { title, description, project_id, assigned_to, status, priority, due_date } = JSON.parse(event.body);
      const result = await sql`
        INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date)
        VALUES (${title}, ${description}, ${project_id}, ${assigned_to}, ${status}, ${priority}, ${due_date})
        RETURNING *
      `;
      return { statusCode: 201, headers, body: JSON.stringify(result[0]) };
    }

    if (event.httpMethod === 'PUT') {
      const { id, status } = JSON.parse(event.body);
      const result = await sql`
        UPDATE tasks SET status = ${status} WHERE id = ${id} RETURNING *
      `;
      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
