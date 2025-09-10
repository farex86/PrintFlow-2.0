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
      const invoices = await sql`SELECT * FROM invoices`;
      return { statusCode: 200, headers, body: JSON.stringify(invoices) };
    }

    if (event.httpMethod === 'POST') {
      const { invoice_number, project_id, client_id, status, total_amount, currency, issue_date, due_date } = JSON.parse(event.body);
      const result = await sql`
        INSERT INTO invoices (invoice_number, project_id, client_id, status, total_amount, currency, issue_date, due_date)
        VALUES (${invoice_number}, ${project_id}, ${client_id}, ${status}, ${total_amount}, ${currency}, ${issue_date}, ${due_date})
        RETURNING *
      `;
      return { statusCode: 201, headers, body: JSON.stringify(result[0]) };
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
