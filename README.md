# Milkshakito

Aplicativo Milkshakito construído com Capacitor.

O cardápio é renderizado pelo componente React `src/App.jsx` e lê a tabela `produtos` diretamente do Supabase. O envio de pedidos e o painel da cozinha ainda usam a API existente.

## Configurar Supabase

1. Copie `.env.example` para `.env.local` na raiz do projeto.
2. Preencha `VITE_SUPABASE_URL` com a URL do projeto e `VITE_SUPABASE_PUBLISHABLE_KEY` com a chave **publishable** (ou `anon`). Nunca use `service_role` ou uma chave secreta no aplicativo.
3. Garanta que a tabela pública `produtos` tenha as colunas `id`, `categoria_id`, `nome`, `descricao`, `preco` e `imagem`, e uma política RLS que permita `SELECT` aos usuários pretendidos.
4. Execute `npm install`, `npm run build` e `npx cap sync android`. Para desenvolvimento no navegador, use `npm run dev`.

O Vite incorpora as variáveis `VITE_` no JavaScript enviado ao dispositivo. `.env.local` fica fora do Git, mas a chave publicável pode ser extraída do aplicativo. A proteção dos dados depende das políticas RLS do Supabase. Após alterar o `.env.local`, gere e sincronize o aplicativo novamente.
