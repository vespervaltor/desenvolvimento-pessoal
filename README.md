# VÉSPER — Personal Development System

> *"Transformar potencial em capacidade e capacidade em realização."*

**VÉSPER** é um sistema pessoal de desenvolvimento humano, desenhado com arquitetura limpa, estética minimalista e foco na documentação de uma trajetória autêntica de amadurecimento e realizações.

---

## 🏛️ Filosofia do Sistema

O Vésper **não** é um aplicativo compulsivo de hábitos nem um gerador de pontuações de validação artificial. 

Sua proposta é reconhecer as fases reais da vida: períodos de crescimento intenso, fases de consolidação e estabilidade, enfrentamento de dificuldades, pausas estratégicas e mudanças conscientes de direção. 

O resultado esperado é um ambiente que permita olhar para trás e reconhecer não apenas o que foi conquistado, mas **quem você se tornou** durante o processo.

---

## 💎 Identidade Visual

- **Estética:** Dashboard executivo premium, sóbrio e minimalista.
- **Paleta de Cores:** Fundo grafite/obsidiana (`#09090b`), superfícies em carvão suave (`#121215`), texto em cinza e branco de alta legibilidade, com detalhes e destaques metálicos discretos em dourado e bronze (`#d4af37`, `#c5a059`).
- **Tipografia:** Família *Cinzel* para a marca e *Inter* para a interface de usuário.
- **Gráficos em SVG Puro:** Radar de equilíbrio das 8 dimensões de vida, evolução cronológica e status de metas, funcionando 100% offline sem bibliotecas pesadas.
- **Responsividade:** Interface adaptada para desktop, tablets e smartphones (com menu lateral recolhível e gaveta móvel).

---

## 🧭 Estrutura e Funcionalidades

O sistema está organizado em 10 módulos navegáveis pela barra lateral:

1. **Dashboard (Visão Geral):**
   - Saudação personalizada com base no horário do dia.
   - Data atual formatada em português.
   - Resumo das metas ativas, taxa de conclusão, reflexões no diário e desafios superados.
   - Objetivos prioritários com checklist interativo imediato.
   - Linha do tempo das últimas reflexões e registros.
   - Gráfico de Teia (Radar) com o equilíbrio das 8 dimensões.
   - Botão de **Registro Rápido** acessível em qualquer tela.

2. **Áreas de Desenvolvimento (8 Dimensões):**
   - **Intelectual:** Leitura, estudos, repertório cultural, argumentação, idiomas e pensamento crítico.
   - **Emocional:** Autoestima, autoconfiança, autocontrole, resiliência, maturidade e independência emocional.
   - **Social:** Comunicação, carisma, amizades, relacionamentos, liderança e experiências sociais.
   - **Profissional:** Concursos públicos, graduação em ADS, carreira, projetos e tecnologia.
   - **Financeira:** Despesas, receitas, patrimônio, reserva de emergência e empreendedorismo.
   - **Física:** Musculação, corrida, condicionamento, nutrição e autocuidado.
   - **Espiritual:** Leitura bíblica, oração, estudos teológicos, vida cristã e serviço ministerial.
   - **Pessoal e Lazer:** Hobbies, música, instrumentos, viagens, entretenimento e novas descobertas.
   - *Sub-visão aprofundada:* cada área possui detalhamento próprio de metas vinculadas e reflexões do diário.

3. **Metas e Objetivos:**
   - Horizontes: Diário, Semanal, Mensal, Anual e Longo Prazo.
   - Prioridades: Baixa, Média, Alta e Essencial.
   - Status: Não iniciado, Em andamento, Concluído e Pausado.
   - Etapas (subtarefas): checklist com caixas de seleção que recalculam automaticamente a porcentagem de conclusão.
   - Filtros dinâmicos e busca instantânea.

4. **Diário de Desenvolvimento:**
   - Registro detalhado com: data/horário, título, dimensão, descrição livre, aprendizado adquirido, dificuldade enfrentada, resultado obtido e reflexão pessoal.
   - Linha do tempo cronológica com busca textual e filtros por dimensão.

5. **Experiências e Desafios:**
   - Registro de atividades para vencer a zona de conforto (diálogos espontâneos, apresentações, jejuns de telas, ações voluntárias).
   - Catálogo de desafios recomendados com um clique para assumir o desafio.
   - Histórico com objetivos, o que foi feito, lições e o que faria diferente.

6. **Estatísticas e Indicadores:**
   - Gráficos em SVG nativo: evolução de registros mensais, proporção de metas e distribuição por área.
   - Indicadores qualitativos sem pontuações artificiais de valor pessoal.

7. **Revisões Periódicas (Semanal e Mensal):**
   - Wizard guiado com as perguntas estruturadas:
     - *Semanal:* Realizações, pendências, dificuldades, aprendizados, comportamento a calibrar e prioridades da próxima semana.
     - *Mensal:* Conquistas centrais, áreas com maior evolução, pontos de estagnação, metas que perderam sentido, decisões a tomar e novos experimentos.
   - Histórico comparativo de revisões arquivadas.

8. **Biblioteca Pessoal:**
   - Acervo de livros, cursos, citações, ideias de projetos, ensaios e filmes.
   - Avaliação por estrelas, citações-chave destacadas e anotações de estudo.

9. **Horizonte 25:**
   - Visão estruturada da trajetória aspiracional aos 25 anos.
   - Manifesto central dos 25 anos.
   - *Carta para o meu eu aos 25 anos*.
   - Marcos intencionais em cada uma das 8 dimensões.

10. **Configurações & Privacidade:**
    - Personalização do nome e subtítulo.
    - Exportação e importação de backup completo em JSON.
    - Exportação de relatórios em CSV (compatíveis com Excel e Google Sheets).
    - Opções de restaurar conjunto de dados demonstrativos ou zerar o sistema.
    - Aviso transparente sobre armazenamento local seguro no navegador.

---

## 🚀 Como Executar

O projeto foi construído com **HTML5, CSS3 e JavaScript Vanilla**, sem necessidade de instalação de Node.js, compilação ou configuração de servidor externo:

1. Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari);
2. Ou, se preferir rodar em um servidor local estático simples:
   ```bash
   # Com Python
   python -m http.server 8080
   # Ou com npx
   npx serve .
   ```
3. Acesse `http://localhost:8080` no navegador.

---

## 🔒 Armazenamento e Privacidade

Todos os seus registros são armazenados no `LocalStorage` do navegador em seu próprio computador. Nenhum dado pessoal é transmitido para servidores remotos. Lembre-se de realizar backups regulares em JSON pelo menu de Configurações para manter seus registros seguros.
