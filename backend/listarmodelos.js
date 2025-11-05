import fetch from "node-fetch";

async function listarModelos() {
  try {
    // Autenticação com a conta de serviço
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: {
        "Authorization": `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("✅ Modelos disponíveis:\n", JSON.stringify(data, null, 2));
  } catch (erro) {
    console.error("❌ Erro ao listar modelos:", erro);
  }
}

listarModelos();
