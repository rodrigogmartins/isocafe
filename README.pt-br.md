<p align="center">
  <img src="assets/images/logo.svg" alt="Iso Café" width="180">
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/lang-English-1f6feb?style=flat-square" alt="English"></a>
  <a href="README.pt-br.md"><img src="https://img.shields.io/badge/lang-Portugu%C3%AAs-2ea043?style=flat-square" alt="Português"></a>
</p>

<h3 align="center">Transforme um café em uma história que vale compartilhar.</h3>

<p align="center">
  <img src="https://img.shields.io/badge/status-prot%C3%B3tipo-orange" alt="Protótipo">
  <img src="https://img.shields.io/badge/experi%C3%AAncia-mobile--first-3b2b20" alt="Mobile first">
</p>

<p align="center">
  <a href="https://rodrigogmartins.github.io/isocafe/"><img src="assets/images/qr-code.png" width="220" alt="QR code da experiência Iso Café"></a><br>
  <a href="https://rodrigogmartins.github.io/isocafe/"><strong>Abrir a experiência do Iso Café</strong></a><br>
  Aponte a câmera do celular para apresentar aos donos.
</p>

---

## Por quê

Uma visita à cafeteria pode continuar além da mesa: uma foto publicada por um cliente apresenta o ambiente à rede de amigos dele. O projeto conecta esse gesto a uma experiência curta, afetiva e coerente com a marca.

A proposta é **testar um caminho para reduzir o custo de aquisição de clientes (CAC), estimular conteúdo espontâneo e aumentar o engajamento de quem já frequenta o Iso Café**. A redução de CAC é uma hipótese a validar no piloto, não um resultado já comprovado.

## O quê

**Uma experiência de fotografia gamificada: o cliente compartilha seu café, revela uma foto instantânea e encontra uma dedicatória no verso.**

O cliente publica um Story marcando **@isocaferg**, toca em “Já publiquei” e movimenta uma foto na tela. A imagem aparece aos poucos. Ao virar o cartão, uma mensagem manuscrita revela o resultado e, quando há prêmio, um código para apresentar no balcão.

A fotografia conecta a ação desejada — registrar e compartilhar uma visita — à ideia de guardar uma lembrança.

## Como

1. **Compartilhar:** o QR code abre uma página que convida a publicar um Story e marcar a cafeteria.
2. **Revelar:** movimentos para os lados tornam a foto nítida; a interação exige movimento e dura no mínimo **4 segundos**.
3. **Virar:** o botão “Virar foto” apresenta a dedicatória em escrita cursiva, surgindo aos poucos.
4. **Descobrir:** data, mensagem e eventual código ficam no verso do mesmo cartão.
5. **Apresentar:** quem ganha mostra a foto e o código à equipe.

O layout se adapta ao celular, inclusive em paisagem. Mouse e teclado também funcionam, e a experiência respeita a preferência por movimento reduzido.

## O que a cafeteria ganha com o piloto

- **Uma hipótese de aquisição mais eficiente:** incentivar indicações por publicações dos clientes e comparar o custo dos incentivos com novos clientes atribuídos à ação.
- **Mais participação durante a visita:** uma interação tátil e curta que convida a completar a experiência.
- **Uma identidade memorável:** fotografias, papel creme, tons de café e uma dedicatória pessoal.
- **Uma apresentação simples:** QR code, navegador e nenhuma instalação para o cliente.

### Como medir

| Objetivo | Indicador sugerido | Coleta no piloto |
|---|---|---|
| Engajamento | Experiências concluídas ÷ iniciadas | Instrumentar início, revelação e virada |
| Compartilhamento | Stories com marcação da cafeteria | Conferir menções recebidas |
| Aquisição | Novos clientes atribuídos à campanha | Perguntar a origem no atendimento |
| CAC | Custos da campanha e prêmios ÷ novos clientes atribuídos | Registrar custos reais, resgates e novos clientes |
| Retorno | Participantes que voltam à loja | Acompanhamento consentido no atendimento |

Compare com um período-base ou grupo de referência. Visitas ao link e participações não equivalem, por si só, a novos clientes. **O protótipo ainda não coleta esses indicadores automaticamente.**

---

## Começar rapidamente

**Requisitos:** navegador moderno. Python 3 é uma opção para servir os arquivos; não há build, dependências npm ou backend.

Na pasta do projeto:

~~~bash
python -m http.server 8000
~~~

Abra [http://localhost:8000](http://localhost:8000). No Windows, também pode usar:

~~~powershell
py -3 -m http.server 8000
~~~

Para uma conferência rápida, abra `index.html` diretamente no navegador. O servidor local é preferível para reproduzir o comportamento da hospedagem.

Para testar no celular, deixe telefone e computador na mesma rede Wi-Fi e abra `http://IP-DO-COMPUTADOR:8000` no telefone, com o servidor em execução.

As imagens e o QR code são locais. As fontes vêm do Google Fonts; sem conexão, o navegador usa as alternativas do CSS.

## Configuração

Edite [assets/js/app.js](assets/js/app.js):

| Configuração | Valor atual | Finalidade |
|---|---|---|
| `TEST_MODE` | `true` | Permitir novas participações ao recarregar |
| `PHOTO_REVEAL_MIN_MS` | `4000` | Tempo mínimo da revelação |
| `PHOTO_TRAVEL_MULTIPLIER` | `8.5` | Movimento exigido; maior = mais movimento |
| `DISCOUNT_TEXT` | `R$ 2` + `de desconto` | Atualiza etiqueta, nome do prêmio e dedicatória |
| `prizes` | Tabela abaixo | Probabilidades dos resultados |
| `photoAssets` | `assets/images/` | Foto e descrição de cada resultado |

| Resultado | Probabilidade |
|---|---:|
| Café por conta da casa | 10% |
| Sobremesa | 5% |
| R$ 2 de desconto | 15% |
| Sem prêmio | 70% |

O resultado é sorteado uma vez por participação. Movimentar ou virar a foto não altera o prêmio nem o código. Ao editar probabilidades, mantenha a soma em **1 (100%)**.

Com `TEST_MODE = false`, o bloqueio atual usa `localStorage`: limita a participação naquele navegador **sem expiração diária**. Limpar os dados do navegador remove o bloqueio.

## Estrutura

~~~text
index.html
assets/
  css/styles.css
  js/app.js
  images/
    logo.svg
    logo-original.png
    cafe.png
    sobremesa.png
    desconto.png
    cafeteria.png
    qr-code.png
    qr-code.svg
README.md
README.pt-br.md
~~~

- [index.html](index.html): estrutura e conteúdo.
- [styles.css](assets/css/styles.css): layout, cores e animações.
- [app.js](assets/js/app.js): sorteio, revelação, virada e dedicatória.
- `assets/images/`: imagens e QR code.

## Apresentar e publicar

O QR code aponta exatamente para **https://rodrigogmartins.github.io/isocafe/**. Esse endereço precisa estar publicado para funcionar no celular dos donos; gerar o QR code não publica o site.

Para hospedar no GitHub Pages, publique a raiz deste projeto no repositório correspondente, mantendo `index.html` e `assets/` juntos. Os caminhos relativos suportam o endereço `/isocafe/`.

Use o [PNG do QR code](assets/images/qr-code.png) para compartilhar ou o [SVG](assets/images/qr-code.svg) para imprimir. Preserve a margem livre ao redor do código.

## Estado do projeto e próximos passos

Esta é uma demonstração funcional no navegador. A raspadinha foi removida; a foto instantânea é a experiência principal.

- “Já publiquei” é uma confirmação do cliente; não há verificação de Stories pela API do Instagram.
- Sorteio, bloqueio e códigos são locais. Os códigos não são registrados em servidor nem marcados como resgatados.
- As fotos são ilustrativas, geradas por IA; não documentam o espaço ou os produtos reais. Substitua por fotos oficiais quando disponíveis.
- O desenho original foi preservado em `logo-original.png`. O arquivo `logo.svg` reutiliza esse desenho com um filtro de transparência e tinta escura; no loading, o CSS deixa o traço claro. Um arquivo oficial em alta resolução pode substituí-lo futuramente.
- Analytics, estoque de prêmios, validação de resgates e regras em servidor são próximos passos para operar uma campanha e medir seu impacto.

**Proposta do piloto:** apresentar aos donos, validar a experiência com clientes, medir compartilhamentos e resgates e decidir a evolução com base nos resultados.
