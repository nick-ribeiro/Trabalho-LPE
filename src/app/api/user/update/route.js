import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { updateUsuarioDB } from "@/bd/usecases/usuariosUseCases";

export async function POST(req) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return new Response(JSON.stringify({ message: "Não autorizado" }), {
        status: 401,
      });
    }
  
    const userEmail = session.user.email;
    const updateFields = await req.json();
  
    const objeto = { email: userEmail, ...updateFields };
  
    try {
      const response = await updateUsuarioDB(objeto);
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: error }), {
        status: 500,
      });
    }
}