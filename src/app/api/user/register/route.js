import { registraUsuarioDB } from '@/bd/usecases/usuariosUseCases';

export async function POST(req) {
  const body = await req.json();

  try {
    const result = await registraUsuarioDB(body);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
