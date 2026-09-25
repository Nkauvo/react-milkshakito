import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [categoriaAtual, setCategoriaAtual] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function buscarProdutos() {
      try {
        if (!supabase) throw new Error('Configure o Supabase em .env.local.');
        const { data, error } = await supabase.from('produtos').select('*').order('id');
        if (error) throw error;
        if (ativo) setProdutos(data ?? []);
      } catch (err) {
        if (ativo) setErro(err.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscarProdutos();
    return () => { ativo = false; };
  }, []);

  if (carregando) return <p className="text-center py-16 text-cinza">Carregando dados da nuvem...</p>;
  if (erro) return <p role="alert" className="text-center py-10 text-red-600">Erro ao carregar o cardápio: {erro}</p>;
  if (produtos.length === 0) return <p className="text-center py-10 text-cinza">Nenhum produto cadastrado.</p>;

  const grupos = produtos.reduce((resultado, produto) => {
    (resultado[produto.categoria_id] ??= []).push(produto);
    return resultado;
  }, {});
  const categorias = Object.entries(grupos);
  let inicioToque = 0;

  return <>
    <div className="lg:hidden text-center text-sm text-cinza mb-3">Deslize para ver outras categorias</div>
    <div>
      <div
        className="flex lg:grid lg:grid-cols-2 lg:gap-12 lg:transform-none transition-transform duration-300"
        style={{ transform: `translateX(-${categoriaAtual * 100}%)` }}
        onTouchStart={event => { inicioToque = event.touches[0].clientX; }}
        onTouchEnd={event => {
          if (window.innerWidth >= 1024) return;
          const diferenca = event.changedTouches[0].clientX - inicioToque;
          if (Math.abs(diferenca) > 60) {
            setCategoriaAtual(atual => Math.max(0, Math.min(categorias.length - 1, atual + (diferenca < 0 ? 1 : -1))));
          }
        }}
      >
        {categorias.map(([id, itens]) => <div key={id} className="category-panel">
          <h3 className="text-principal text-xl font-bold border-b-2 border-gray-100 pb-2 mb-4">
            {({ 1: 'Clássicos', 2: 'Especiais' })[id] ?? `Categoria ${id}`}
          </h3>
          {itens.map(produto => <button
            type="button"
            key={produto.id}
            className="menu-item flex items-center gap-4 py-4 border-b border-dashed text-left w-full"
            onClick={() => window.abrirModalDetalhes(produto.nome, produto.preco, produto.descricao, produto.imagem)}
          >
            <img src={produto.imagem || './assets/images/logoshake.png'} alt={produto.nome} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-sm" onError={event => { event.currentTarget.src = './assets/images/logoshake.png'; }} />
            <span className="flex-1"><strong className="block">{produto.nome}</strong><span className="text-sm text-cinza">{produto.descricao}</span></span>
            <span className="text-principal font-bold text-lg flex-shrink-0">{Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </button>)}
        </div>)}
      </div>
    </div>
    {categorias.length > 1 && <div className="flex justify-center gap-3 mt-8 lg:hidden" aria-label="Categorias">
      {categorias.map(([id], indice) => <button key={id} type="button" aria-label={`Categoria ${indice + 1}`} onClick={() => setCategoriaAtual(indice)} className={`w-2.5 h-2.5 rounded-full ${indice === categoriaAtual ? 'bg-principal' : 'bg-gray-300'}`} />)}
    </div>}
  </>;
}
