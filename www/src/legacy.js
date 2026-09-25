        // MENU HAMBURGUER
        // Ao clicar no botão, adiciona/remove a classe "active"
        // no botão (animação X), no nav (desliza) e no overlay
        // (fundo escuro). Ao clicar no overlay, fecha o menu.
        const btn = document.getElementById('hamburger-btn');
        const nav = document.querySelector('.nav-menu');
        const overlay = document.getElementById('overlay');
        const links = document.querySelectorAll('.nav-link');

        const toggleMenu = () => {
            btn.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            // Trava o scroll do body enquanto o menu estiver aberto
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        };

        btn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        // Fecha o menu ao clicar em qualquer link de navegação
        links.forEach(l => l.addEventListener('click', toggleMenu));

        // ADICIONADO: Modal de Detalhes do Produto
        //
        // Guarda referência dos elementos do modal de detalhes.
        const modalDetalhes = document.getElementById('detalhes-modal');
        const modalDetalhesContent = document.getElementById('detalhes-modal-content');

        // Abre o modal e preenche com os dados do produto clicado
        function abrirModalDetalhes(nome, preco, desc, img) {
            // Vibração tátil leve ao abrir (funciona em celulares)
            if (navigator.vibrate) navigator.vibrate(40);

            // Preenche os campos do modal com os dados recebidos
            document.getElementById('detalhes-nome').innerText = nome;
            document.getElementById('detalhes-preco').innerText = `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
            document.getElementById('detalhes-desc').innerText = desc;
            document.getElementById('detalhes-img').src = img || './assets/images/logoshake.png';

            // Define dinamicamente o que o botão "Adicionar" faz para este produto
            document.getElementById('detalhes-btn-add').onclick = function () {
                adicionarItem(nome, parseFloat(preco));
                fecharModalDetalhes(); // fecha o modal após adicionar
            };

            // Torna o modal visível (remove as classes que o escondem)
            modalDetalhes.classList.remove('opacity-0', 'pointer-events-none');
            // Pequeno delay para a animação de escala funcionar corretamente
            setTimeout(() => {
                modalDetalhesContent.classList.remove('scale-95');
                modalDetalhesContent.classList.add('scale-100');
            }, 10);
        }

        // Fecha o modal com animação reversa (encolhe e some)
        function fecharModalDetalhes() {
            modalDetalhesContent.classList.remove('scale-100');
            modalDetalhesContent.classList.add('scale-95');
            // Espera a animação de escala terminar antes de esconder
            setTimeout(() => {
                modalDetalhes.classList.add('opacity-0', 'pointer-events-none');
            }, 300);
        }

        // ADICIONADO: Fecha o modal de detalhes ao clicar no fundo escuro
        // e.target === modalDetalhes garante que só fecha se clicar fora do card
        modalDetalhes.addEventListener('click', function (e) {
            if (e.target === modalDetalhes) fecharModalDetalhes();
        });

        // LÓGICA DO CARRINHO
        // Array que guarda os itens do carrinho em memória
        let carrinho = [];

        // ADICIONADO: inicializarCarrinho()
        // Antes o carrinho começava sempre vazio ao abrir a página.
        // Agora ele lê o localStorage e restaura os itens salvos,
        // então o usuário não perde o pedido ao recarregar a página.
        function inicializarCarrinho() {
            const carrinhoSalvo = localStorage.getItem('milk_cart');
            if (carrinhoSalvo) {
                // Converte o texto JSON de volta para array JavaScript
                carrinho = JSON.parse(carrinhoSalvo);
                // Atualiza a tela com os itens recuperados
                atualizarCarrinhoUI();
            }
        }

        // Referências aos elementos visuais do carrinho
        const cartModal = document.getElementById('cart-modal');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalValue = document.getElementById('cart-total-value');
        const cartCount = document.getElementById('cart-count');
        const cartBtn = document.getElementById('cart-btn');

        // ADICIONADO: adicionarItem()
        // Função centralizada para adicionar produtos ao carrinho.
        // É chamada pelo botão dentro do modal de detalhes.
        // Se o item já existir, apenas aumenta a quantidade.
        function adicionarItem(nome, preco) {
            // Vibração de feedback ao adicionar item
            if (navigator.vibrate) navigator.vibrate(200);

            // Verifica se o item já está no carrinho
            const ex = carrinho.find(i => i.nome === nome);
            if (ex) {
                ex.qtd++; // já existe: incrementa a quantidade
            } else {
                carrinho.push({ nome, preco, qtd: 1 }); // novo item
            }
            atualizarCarrinhoUI();
        }

        // Renderiza a lista de itens no modal do carrinho e atualiza totais
        function atualizarCarrinhoUI() {
            cartItemsDiv.innerHTML = '';
            let total = 0, totalItens = 0;

            // Se carrinho vazio, exibe mensagem
            if (carrinho.length === 0) {
                cartItemsDiv.innerHTML = '<p class="text-center text-gray-400 py-10">Carrinho vazio...</p>';
            }

            // Para cada item, cria um card com nome, preço, controles de quantidade e botão remover
            carrinho.forEach((item, index) => {
                total += item.preco * item.qtd;
                totalItens += item.qtd;
                cartItemsDiv.innerHTML += `
                    <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <div class="flex-1">
                            <p class="font-bold text-gray-800">${item.nome}</p>
                            <div class="flex items-center gap-3 mt-1">
                                <button onclick="alterarQtd(${index}, -1)" class="w-7 h-7 flex items-center justify-center bg-white border rounded-lg shadow-sm hover:bg-gray-50">-</button>
                                <span class="font-bold text-sm">${item.qtd}</span>
                                <button onclick="alterarQtd(${index}, 1)" class="w-7 h-7 flex items-center justify-center bg-white border rounded-lg shadow-sm hover:bg-gray-50">+</button>
                            </div>
                        </div>
                        <div class="flex items-center gap-5">
                            <span class="font-bold text-principal">R$ ${(item.preco * item.qtd).toFixed(2)}</span>
                            <button onclick="removerItem(${index})" class="text-red-400 hover:text-red-600 transition-colors">
                                <i class="fa-solid fa-trash-can text-lg"></i>
                            </button>
                        </div>
                    </div>`;
            });

            // Atualiza o total exibido e o contador no botão flutuante
            cartTotalValue.innerText = `R$ ${total.toFixed(2)}`;
            cartCount.innerText = totalItens;

            // Mostra ou esconde o botão flutuante do carrinho conforme quantidade
            cartBtn.classList.toggle('hidden', totalItens === 0);

            // Salva o estado atual do carrinho no localStorage para persistir entre recarregamentos
            localStorage.setItem('milk_cart', JSON.stringify(carrinho));
        }

        // Aumenta ou diminui a quantidade de um item (delta = +1 ou -1)
        window.alterarQtd = (index, delta) => {
            carrinho[index].qtd += delta;
            if (carrinho[index].qtd <= 0) removerItem(index); // remove se chegar a 0
            else atualizarCarrinhoUI();
        };

        // Remove um item do carrinho pelo índice
        window.removerItem = (index) => {
            carrinho.splice(index, 1);
            atualizarCarrinhoUI();
        };

        const API_URL = 'https://backend-aula07-milkshakito-vercel.vercel.app/api';

        function abrirModalCarrinho() {
            cartModal.classList.remove('hidden'); // remove o que esconde
            cartModal.classList.add('flex');      // adiciona flex para centralizar
        }

        function fecharModalCarrinho() {
            cartModal.classList.add('hidden');    // esconde novamente
            cartModal.classList.remove('flex');   // remove o flex
        }

        // Abre o carrinho ao clicar no botão flutuante
        cartBtn.addEventListener('click', abrirModalCarrinho);

        // Abre o carrinho ao clicar no link "CARRINHO" do menu de navegação
        document.getElementById('cart-menu-link').addEventListener('click', () => {
            abrirModalCarrinho();
            toggleMenu(); // fecha o menu lateral também
        });

        // Fecha o carrinho ao clicar no botão "Voltar"
        document.getElementById('close-cart').addEventListener('click', fecharModalCarrinho);

        // ADICIONADO: Fecha o carrinho ao clicar no fundo escuro
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) fecharModalCarrinho();
        });

        // INTEGRAÇÃO API - FINALIZAÇÃO DO PEDIDO
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.addEventListener('click', async () => {
            
            // 1. Pega os elementos e valores dos inputs CORRETOS que estão ativos no seu HTML
            const nomeInput = document.getElementById('cliente-nome');
            const enderecoInput = document.getElementById('cliente-endereco');
            const nome = nomeInput.value.trim();
            const endereco = enderecoInput.value.trim();

            // 2. Validações fundamentais
            if (carrinho.length === 0) {
                return alert("Seu carrinho está vazio!");
            }
            if (!nome || !endereco) {
                return alert("Por favor, informe seu nome e endereço para finalizar o pedido.");
            }

            const originalText = checkoutBtn.innerText;
            checkoutBtn.disabled = true;
            checkoutBtn.innerText = "Enviando Pedido...";
            checkoutBtn.classList.add("opacity-50");

            // Calcula o total do pedido usando 'item.qtd' (que é como o Gabriel nomeou)
            const total = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

            // Mapeia o carrinho para o padrão que a API/Cozinha espera (quantidade em vez de qtd)
            const itensFormatados = carrinho.map(item => ({
                nome: item.nome,
                preco: item.preco,
                quantidade: item.qtd
            }));

            // Monta o pacote de dados EXATAMENTE como a API e o banco de dados esperam!
            const payloadPedido = {
                cliente_nome: nome,
                cliente_endereco: endereco,
                itens: itensFormatados,
                total: total
            };

            try {
                // Envia (POST) os dados para a API (Vercel)
                const resposta = await fetch(`${API_URL}/pedidos`, {
                    method: 'POST', // Tipo de envio
                    headers: {
                        'Content-Type': 'application/json' // Avisa que estamos mandando JSON
                    },
                    body: JSON.stringify(payloadPedido) // Transforma o objeto em texto JSON
                });

                if (!resposta.ok) throw new Error('Erro ao enviar pedido');

                alert(`✅ PEDIDO CONCLUÍDO!\n\nCliente: ${nome}\nEndereço: ${endereco}\n\nO pedido já foi enviado para a cozinha! Obrigado por pedir no MilkShakito!`);
                
                // Se deu tudo certo, limpamos os campos e o carrinho
                finalizarComSucesso();

            } catch (erro) {
                console.error(erro);
                alert("Ops! Ocorreu um problema de conexão. Tente novamente.");
            } finally {
                // Volta o botão ao normal indepente se deu erro ou sucesso
                checkoutBtn.innerText = originalText;
                checkoutBtn.disabled = false;
                checkoutBtn.classList.remove("opacity-50");
            }

            // Função auxiliar para limpar os campos e o carrinho após o sucesso
            function finalizarComSucesso() {
                carrinho = [];
                atualizarCarrinhoUI();
                fecharModalCarrinho();
                nomeInput.value = '';
                enderecoInput.value = '';
            }
        });
        // Chamada inicial ao carregar a página:
        // 1. Restaura o carrinho salvo no localStorage
        // 2. Busca o cardápio na API (com imagens do Supabase)

        Object.assign(window, { abrirModalDetalhes, fecharModalDetalhes, alterarQtd, removerItem });
        inicializarCarrinho();

        if (import.meta.env.DEV && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(registration => registration.unregister()));
        }

        if (import.meta.env.PROD && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker Registrado no Porto! 🍣', reg))
                .catch(err => console.error('Erro ao preparar o sushi: ', err));
            });
        }

