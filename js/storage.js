/**
 * VÉSPER - Sistema de Persistência e Armazenamento Local
 * Camada de dados com LocalStorage, exportação/importação JSON, exportação CSV e integridade de dados.
 */

const STORAGE_KEY = 'vesper_system_data_v2';

const AREAS_DEFINITION = {
  intelectual: {
    id: 'intelectual',
    name: 'Intelectual',
    color: '#818cf8',
    description: 'Leitura, estudos, repertório cultural, argumentação, idiomas, pensamento crítico e conhecimentos gerais.'
  },
  emocional: {
    id: 'emocional',
    name: 'Emocional',
    color: '#f472b6',
    description: 'Autoestima, autoconfiança, autocontrole, resiliência, maturidade e independência emocional.'
  },
  social: {
    id: 'social',
    name: 'Social',
    color: '#38bdf8',
    description: 'Comunicação, carisma, amizades, relacionamentos, desenvoltura, liderança e experiências sociais.'
  },
  profissional: {
    id: 'profissional',
    name: 'Profissional',
    color: '#fbbf24',
    description: 'Concursos públicos, graduação em ADS, experiência profissional, cursos, projetos e desenvolvimento de carreira.'
  },
  financeira: {
    id: 'financeira',
    name: 'Financeira',
    color: '#34d399',
    description: 'Controle de despesas, receitas, patrimônio, planejamento financeiro e empreendedorismo.'
  },
  fisica: {
    id: 'fisica',
    name: 'Física',
    color: '#f87171',
    description: 'Musculação, corrida, condicionamento físico, saúde, alimentação, aparência e cuidados pessoais.'
  },
  espiritual: {
    id: 'espiritual',
    name: 'Espiritual',
    color: '#c084fc',
    description: 'Leitura bíblica, oração, estudos teológicos, vida cristã e participação ministerial.'
  },
  pessoal: {
    id: 'pessoal',
    name: 'Pessoal e Lazer',
    color: '#fb923c',
    description: 'Hobbies, viagens, dança, música, experiências, entretenimento e novas descobertas.'
  }
};

const DEFAULT_DEMO_DATA = {
  profile: {
    name: 'Gabriel Santos',
    subtitle: 'Estudante de ADS & Aspirante a Concursos',
    horizonAge: 25,
    joinedDate: '2026-01-15'
  },
  goals: [
    {
      id: 'g-1',
      title: 'Dominar Estruturas de Dados e Algoritmos em ADS',
      description: 'Aprofundar em grafos, árvores binárias e análise de complexidade assintótica (Big-O) para projetos acadêmicos e provas técnicas.',
      area: 'profissional',
      horizon: 'mensal',
      priority: 'alta',
      status: 'em_andamento',
      createdAt: '2026-11-01',
      deadline: '2026-12-15',
      stages: [
        { id: 's-1', title: 'Compreender árvores binárias e algoritmos de busca (DFS/BFS)', done: true },
        { id: 's-2', title: 'Implementar 15 exercícios práticos em repositório GitHub', done: true },
        { id: 's-3', title: 'Elaborar artigo de síntese com mapa conceitual', done: false }
      ],
      progress: 67,
      history: [
        { date: '2026-11-01', text: 'Objetivo estabelecido com foco no semestre letivo.' },
        { date: '2026-11-14', text: 'Concluída a bateria de exercícios de algoritmos recursivos.' }
      ]
    },
    {
      id: 'g-2',
      title: 'Ciclo Constante de Estudos para Concurso Público',
      description: 'Manter rotina sólida em Direito Constitucional, Administrativo e Língua Portuguesa com resolução sistemática de questões.',
      area: 'profissional',
      horizon: 'anual',
      priority: 'essencial',
      status: 'em_andamento',
      createdAt: '2026-09-01',
      deadline: '2027-06-30',
      stages: [
        { id: 's-4', title: 'Fechar o edital verticalizado de Direito Constitucional', done: true },
        { id: 's-5', title: 'Resolver 600 questões da banca examinadora alvo', done: true },
        { id: 's-6', title: 'Fazer 1 simulado quinzenal cronometrado com redação', done: false }
      ],
      progress: 66,
      history: [
        { date: '2026-09-01', text: 'Ciclo inaugurado com cronograma de repetições espaçadas.' },
        { date: '2026-11-10', text: 'Atingida a marca de 78% de acertos médios em Direito Constitucional.' }
      ]
    },
    {
      id: 'g-3',
      title: 'Leitura e Fichamento de Obras de Filosofia e Literatura Clássica',
      description: 'Expandir o vocabulário, clareza lógica e capacidade argumentativa através do estudo das Meditações de Marco Aurélio e ensaios de C.S. Lewis.',
      area: 'intelectual',
      horizon: 'mensal',
      priority: 'media',
      status: 'em_andamento',
      createdAt: '2026-11-05',
      deadline: '2026-12-20',
      stages: [
        { id: 's-7', title: 'Leitura dos Livros I a VI de Meditações', done: true },
        { id: 's-8', title: 'Fichamento de citações e lições no Diário Vésper', done: true },
        { id: 's-9', title: 'Escrever redação reflexiva sintetizando princípios estóicos', done: false }
      ],
      progress: 67,
      history: [
        { date: '2026-11-05', text: 'Iniciada a leitura com anotações de margem.' }
      ]
    },
    {
      id: 'g-4',
      title: 'Regularidade Atlética: 4x Musculação e 1 Corrida Semanal',
      description: 'Construir vigor físico, saúde cardiovascular e disciplina mental através da adesão contínua aos treinos de força e resistência.',
      area: 'fisica',
      horizon: 'semanal',
      priority: 'alta',
      status: 'em_andamento',
      createdAt: '2026-11-18',
      deadline: '2026-11-29',
      stages: [
        { id: 's-10', title: 'Treino A - Membros Superiores e Core', done: true },
        { id: 's-11', title: 'Treino B - Membros Inferiores e Mobilidade', done: true },
        { id: 's-12', title: 'Treino C - Costas e Ombros', done: true },
        { id: 's-13', title: 'Corrida ao ar livre (5 km com ritmo constante)', done: false }
      ],
      progress: 75,
      history: [
        { date: '2026-11-18', text: 'Semana de treino planejada com hidratação monitorada.' }
      ]
    },
    {
      id: 'g-5',
      title: 'Consolidação da Reserva de Tranquilidade Financeira',
      description: 'Aportar mensalmente valores direcionados a cobrir 6 meses de custo fixo em ativos conservadores de alta liquidez.',
      area: 'financeira',
      horizon: 'longo_prazo',
      priority: 'essencial',
      status: 'em_andamento',
      createdAt: '2026-06-01',
      deadline: '2027-12-31',
      stages: [
        { id: 's-14', title: 'Mapear e reduzir despesas invisíveis e assinaturas ociosas', done: true },
        { id: 's-15', title: 'Atingir o equivalente a 3 meses de reserva guardados', done: true },
        { id: 's-16', title: 'Completar 6 meses de segurança e iniciar diversificação', done: false }
      ],
      progress: 67,
      history: [
        { date: '2026-06-01', text: 'Definição do plano orçamentário mensal com planilha de custos.' },
        { date: '2026-10-30', text: 'Atingida a meta intermediária de 3 meses de reserva.' }
      ]
    },
    {
      id: 'g-6',
      title: 'Devocional Matinal e Participação Ministerial Ativa',
      description: 'Cultivar comunhão com Deus, estudo minucioso dos Evangelhos e serviço dedicado na comunidade local da igreja.',
      area: 'espiritual',
      horizon: 'anual',
      priority: 'essencial',
      status: 'em_andamento',
      createdAt: '2026-01-01',
      deadline: '2026-12-31',
      stages: [
        { id: 's-17', title: 'Leitura contínua do Novo Testamento com diário espiritual', done: true },
        { id: 's-18', title: 'Engajamento no ministério de louvor ou apoio operacional', done: true },
        { id: 's-19', title: 'Participação em retiro espiritual ou estudo teológico aprofundado', done: true }
      ],
      progress: 100,
      history: [
        { date: '2026-01-01', text: 'Início do cronograma anual de oração e leitura bíblica.' },
        { date: '2026-11-15', text: 'Todas as etapas programadas para o ciclo cumpridas com zelo.' }
      ]
    },
    {
      id: 'g-7',
      title: 'Prática de Escuta Ativa e Presença Autêntica em Conversas',
      description: 'Desenvolver magnetismo pessoal respeitoso, sem necessidade de validação imediata, ouvindo com atenção e articulando ideias com calma.',
      area: 'social',
      horizon: 'mensal',
      priority: 'alta',
      status: 'em_andamento',
      createdAt: '2026-11-01',
      deadline: '2026-11-30',
      stages: [
        { id: 's-20', title: 'Pausar 3 segundos antes de responder a perguntas importantes', done: true },
        { id: 's-21', title: 'Fazer ao menos 2 perguntas sinceras sobre o outro em conversas', done: true },
        { id: 's-22', title: 'Evitar interrupções automáticas em diálogos em grupo', done: true }
      ],
      progress: 100,
      history: [
        { date: '2026-11-01', text: 'Objetivo de maturidade relacional ativado.' }
      ]
    },
    {
      id: 'g-8',
      title: 'Aprender Peças no Teclado / Piano para Cultivo Pessoal',
      description: 'Dedicar momentos de descanso restaurador à música instrumental e sensibilidade artística.',
      area: 'pessoal',
      horizon: 'longo_prazo',
      priority: 'baixa',
      status: 'em_andamento',
      createdAt: '2026-07-01',
      deadline: '2027-02-28',
      stages: [
        { id: 's-23', title: 'Dominar formação de acordes básicos e tétrades', done: true },
        { id: 's-24', title: 'Executar duas canções completas com ambas as mãos em harmonia', done: false }
      ],
      progress: 50,
      history: [
        { date: '2026-07-01', text: 'Início da prática regular aos finais de semana.' }
      ]
    }
  ],
  diary: [
    {
      id: 'd-1',
      date: '2026-11-22T21:15',
      title: 'Clareza sob pressão durante apresentação de projeto em ADS',
      area: 'profissional',
      description: 'Apresentei a arquitetura de uma API modular para a turma e o orientador. No início senti a aceleração dos batimentos, mas respirei fundo, apoiei os pés com firmeza no chão e mantive tom firme.',
      learned: 'A ansiedade antes de falar em público diminui quando você foca no valor da mensagem que está entregando aos outros, e não no julgamento pessoal sobre si.',
      difficulty: 'Manter a cadência de fala sem correr com os slides quando o tempo começou a apertar.',
      result: 'Feedback excelente do professor e clareza nas respostas técnicas às dúvidas levantadas.',
      reflection: 'Potencial só se torna capacidade quando nos colocamos no teste da exposição real.'
    },
    {
      id: 'd-2',
      date: '2026-11-17T18:40',
      title: 'A calma de abdicar da discussão desnecessária',
      area: 'emocional',
      description: 'Em um grupo de estudos, surgiu um debate inflamado sobre metodologia sem utilidade prática. Em vez de disputar o ponto para provar quem estava certo, optei pelo silêncio cordial e direcionei para a resolução do trabalho.',
      learned: 'Maturidade é saber que a necessidade de convencer todo mundo é uma fraqueza do ego, não uma virtude da razão.',
      difficulty: 'Segurar a resposta imediata que já estava formulada na ponta da língua.',
      result: 'O ambiente desacelerou e o grupo produziu mais sem atritos.',
      reflection: 'O silêncio estratégico economiza energia preciosa para os objetivos que realmente importam.'
    },
    {
      id: 'd-3',
      date: '2026-11-12T07:30',
      title: 'Corrida matinal com chuva fina e superação da inércia',
      area: 'fisica',
      description: 'Acordei às 05:40 com o som de chuva fina lá fora. A cama estava acolhedora, mas vesti o tênis sem negociar com a mente. Corri 5 km no parque molhado.',
      learned: 'A mente tenta negociar conforto nos primeiros 3 minutos; depois que o movimento começa, o corpo agradece.',
      difficulty: 'Superar o atrito inicial dos primeiros passos com garoa.',
      result: 'Sensação profunda de autocontrole, clareza mental e dia extremamente produtivo.',
      reflection: 'A autoconfiança é a recompensa que a mente dá para quem cumpre o que prometeu a si mesmo em segredo.'
    },
    {
      id: 'd-4',
      date: '2026-11-08T22:00',
      title: 'Oração em solitude e realinhamento de intenções',
      area: 'espiritual',
      description: 'Reservei uma hora da noite sem telas, em oração sincera e reflexão bíblica no Salmo 90. Olhei para as metas dos próximos anos e perguntei se estavam alinhadas com princípios éticos e de serviço ao próximo.',
      learned: 'Conquistas sem retidão de caráter produzem apenas soberba vazia. O propósito ancora as ambições.',
      difficulty: 'Desligar a mente dos prazos acadêmicos e do barulho digital.',
      result: 'Paz profunda e diminuição drástica do imediatismo angustiante.',
      reflection: 'Nem toda pausa é perda de tempo; muitas vezes é a calibração da bússola.'
    }
  ],
  experiences: [
    {
      id: 'e-1',
      title: 'Iniciar conversa espontânea com profissional experiente em evento de tecnologia',
      area: 'social',
      date: '2026-10-25',
      objective: 'Romper a hesitação social e praticar abordagem elegante com pessoas desconhecidas.',
      whatWasDone: 'Durante o coffee break de uma palestra sobre Arquitetura de Software, aproximei-me de um arquiteto sênior, comentei sobre o caso de microsserviços citado e fiz perguntas pontuais sobre a transição dele.',
      learned: 'Pessoas experientes gostam genuinamente de compartilhar sabedoria quando a abordagem demonstra respeito, preparo prévio e curiosidade autêntica.',
      whatToDoDifferently: 'Ter meu perfil técnico no LinkedIn e um resumo conciso do meu projeto já engatilhado para trocar contato com mais rapidez.',
      status: 'concluida'
    },
    {
      id: 'e-2',
      title: 'Fazer jejum digital completo de 24 horas no final de semana',
      area: 'emocional',
      date: '2026-11-02',
      objective: 'Desintoxicar a atenção, diminuir estímulos de dopamina barata e testar a capacidade de presença reflexiva.',
      whatWasDone: 'Desliguei o celular das 18h de sábado até as 18h de domingo. Dediquei o tempo a caminhar, ler livros físicos, cozinhar com calma e conversar com a família.',
      learned: 'A dependência do celular é muito mais um tique motor de fuga do tédio do que uma necessidade real de comunicação.',
      whatToDoDifferently: 'Avisar amigos mais próximos com antecedência para evitar preocupações e planejar um caderno de anotações físicas à mão.',
      status: 'concluida'
    },
    {
      id: 'e-3',
      title: 'Liderar uma aula ou reunião técnica em equipe de estudos',
      area: 'profissional',
      date: '2026-11-20',
      objective: 'Desenvolver postura de liderança, didática e clareza na condução de reuniões.',
      whatWasDone: 'Conduzi a sessão de nivelamento de lógica de programação para colegas ingressantes do curso.',
      learned: 'Para ensinar bem, é preciso simplificar a linguagem sem empobrecer o conteúdo.',
      whatToDoDifferently: 'Reservar os últimos 15 minutos exclusivamente para dúvidas individuais.',
      status: 'concluida'
    },
    {
      id: 'e-4',
      title: 'Participar de uma ação social voluntária comunitária',
      area: 'espiritual',
      date: '2026-12-05',
      objective: 'Expandir a consciência social e vivenciar o serviço desinteressado aos necessitados.',
      whatWasDone: 'Planejada distribuição de refeições e acolhimento para pessoas em situação de rua com a equipe da igreja.',
      learned: '',
      whatToDoDifferently: '',
      status: 'planejada'
    }
  ],
  reviews: {
    weekly: [
      {
        id: 'rw-1',
        date: '2026-11-22',
        period: 'Semana 47 / 2026',
        q1_achieved: 'Apresentei o projeto de ADS com excelência, mantive 4 idas à academia e resolvi mais de 120 questões de Direito Constitucional.',
        q2_notAchieved: 'Não consegui avançar na corrida de sábado devido a um compromisso familiar imprevisto e chuva forte.',
        q3_difficulties: 'Cansaço mental acumulado na quinta-feira à noite, o que reduziu o ritmo da leitura de C.S. Lewis.',
        q4_learned: 'Descanso planejado não é atraso; é prevenção contra o esgotamento que cobra um preço muito mais caro depois.',
        q5_improveBehavior: 'Evitar pegar no smartphone nos primeiros 40 minutos após acordar.',
        q6_nextPriorities: 'Concluir o módulo prático de Banco de Dados Relacional, realizar simulado de concurso no domingo e manter rotina matinal.'
      }
    ],
    monthly: [
      {
        id: 'rm-1',
        date: '2026-10-31',
        period: 'Outubro / 2026',
        q1_achievements: 'Conquistei 80% de precisão nos simulados de concurso; consolidei o hábito dos 4 treinos semanais sem falhar; aumentei o aporte na reserva financeira.',
        q2_areasEvolved: 'Profissional e Física apresentaram os maiores saltos de consistência. Emocional demonstrou maior serenidade diante de imprevistos.',
        q3_stagnantAreas: 'Pessoal e Lazer: dediquei pouco tempo ao teclado e a momentos lúdicos de pura descontração.',
        q4_goalsLostRelevance: 'Uma meta de ler 4 livros em 30 dias foi ajustada: qualidade de absorção vale infinitamente mais que número de páginas viradas.',
        q5_decisionsToTake: 'Blindar os sábados à tarde para descanso e música, e não marcar estudos de alta exigência cognitiva nesse horário.',
        q6_experimentsNextMonth: 'Fazer o jejum de dopamina de 24h e participar do evento de tecnologia conversando com pessoas desconhecidas.'
      }
    ]
  },
  library: [
    {
      id: 'lib-1',
      title: 'Meditações',
      author: 'Marco Aurélio',
      category: 'livro',
      area: 'intelectual',
      rating: 5,
      status: 'lendo',
      notes: 'Notas pessoais de um imperador para si mesmo sobre dever, mortalidade, brevidade do tempo e domínio das paixões.',
      keyTakeaway: 'Você tem poder sobre sua mente, não sobre eventos externos. Perceba isso e encontrará força.'
    },
    {
      id: 'lib-2',
      title: 'Christianity and the Social Crisis',
      author: 'Walter Rauschenbusch',
      category: 'livro',
      area: 'espiritual',
      rating: 5,
      status: 'concluido',
      notes: 'Análise profunda da responsabilidade social da fé e do cristianismo histórico na transformação do mundo real.',
      keyTakeaway: 'A fé genuína transborda em justiça ativa e amor prático na sociedade.'
    },
    {
      id: 'lib-3',
      title: 'Algoritmos e Estruturas de Dados Avançadas',
      author: 'Coursera / Prof. Sedgewick',
      category: 'curso',
      area: 'profissional',
      rating: 5,
      status: 'estudando',
      notes: 'Estudo aprofundado com ênfase em implementações limpas e elegância de código.',
      keyTakeaway: 'A escolha correta da estrutura de dados simplifica o algoritmo de forma monumental.'
    },
    {
      id: 'lib-4',
      title: 'Princípios: Vida e Trabalho',
      author: 'Ray Dalio',
      category: 'livro',
      area: 'profissional',
      rating: 4,
      status: 'concluido',
      notes: 'Como documentar princípios operacionais e sistemáticos para guiar decisões de vida sem apego ao ego.',
      keyTakeaway: 'Dor + Reflexão = Progresso.'
    },
    {
      id: 'lib-5',
      title: 'Ideia: Plataforma de Auditoria de Estudos com Questões Espaçadas',
      author: 'Autoria Própria',
      category: 'projeto',
      area: 'profissional',
      rating: 5,
      status: 'planejado',
      notes: 'Criar uma ferramenta web em React/Node integrada para monitorar curvas de esquecimento de concurso.',
      keyTakeaway: 'Aplicar conhecimentos de ADS em um problema que vivo diariamente.'
    },
    {
      id: 'lib-6',
      title: '"Não nos tornamos iluminados imaginando figuras de luz, mas tornando a escuridão consciente."',
      author: 'Carl G. Jung',
      category: 'frase',
      area: 'emocional',
      rating: 5,
      status: 'concluido',
      notes: 'Lembrança de encarar as próprias fragilidades com honestidade radical em vez de tentar fingir perfeição.',
      keyTakeaway: 'Autoconhecimento dói no início, mas é a única fonte sólida de soberania interior.'
    }
  ],
  horizon25: {
    targetAge: 25,
    title: 'Horizonte 25 — A Visão Estruturada da Minha Trajetória',
    manifesto: 'Aos 25 anos, serei um homem técnico e espiritualmente maduro, com autonomia financeira consolidada, mente serena e corpo vigoroso. Não busco validação alheia nem o ruído das multidões; busco ser excelente naquilo que me foi confiado, honrando a Deus e transformando meu potencial em capacidade sólida e minha capacidade em realizações que façam a diferença.',
    letterToSelf: 'Querido Gabriel aos 25 anos,\n\nSe você está lendo isso, lembre-se das noites silenciosas em que estudou algoritmos com paciência, dos dias em que venceu o cansaço para treinar e da serenidade que buscou quando tudo parecia incerto.\n\nVocê construiu sua vida tijolo por tijolo. Não se esqueça de manter a humildade dos que sabem o quanto ainda têm a aprender e a coragem dos que nunca se acovardam diante de um desafio digno. Cuide das pessoas que você ama e nunca negocie seus valores éticos por um atalho fácil.\n\nVocê é o resultado do compromisso diário com a verdade e com a sua evolução.',
    milestones: [
      {
        area: 'profissional',
        title: 'Graduação em ADS concluída com excelência & Aprovação em Concurso Alvo',
        description: 'Diplomação com projetos de impacto no portfólio e posse em cargo público na área de tecnologia ou analista.'
      },
      {
        area: 'financeira',
        title: 'Patrimônio de Segurança & Autonomia Completa',
        description: 'Reserva de emergência integralmente montada, aportes consistentes em carteira de longo prazo e zero dívidas tóxicas.'
      },
      {
        area: 'intelectual',
        title: 'Fluência Prática em Inglês & Leitura de 50 Obras Fundamentais',
        description: 'Capacidade de leitura técnica e conversação natural, além de repertório filosófico e literário consolidado.'
      },
      {
        area: 'emocional',
        title: 'Inabalabilidade e Clareza Interna',
        description: 'Independência emocional, capacidade de tomar decisões difíceis com dignidade e ausência de vitimismo.'
      },
      {
        area: 'fisica',
        title: 'Condicionamento Físico de Alto Nível & Hábitos Inegociáveis',
        description: 'Composição corporal saudável, força funcional, alimentação balanceada e corrida regular de 10 km.'
      },
      {
        area: 'espiritual',
        title: 'Liderança e Serviço Fiel na Comunidade Cristã',
        description: 'Vida devocional viva, discernimento teológico sadio e atuação ministerial frutífera que abençoa vidas.'
      },
      {
        area: 'social',
        title: 'Círculo de Amizades Profundas e Habilidade Diplomática',
        description: 'Relacionamentos maduros baseados em lealdade recíproca, clareza verbal e presença marcante.'
      },
      {
        area: 'pessoal',
        title: 'Viagens Culturais & Repertório Artístico Vivo',
        description: 'Visita a centros históricos, domínio expressivo do teclado e capacidade de desfrutar o belo sem pressa.'
      }
    ]
  },
  settings: {
    userName: 'Gabriel Santos',
    userRole: 'Estudante de ADS & Aspirante a Concursos',
    autoSave: true,
    compactView: false,
    installedDate: '2026-11-23'
  }
};

class VesperStorage {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profile && (parsed.profile.name === 'Jéssica' || !parsed.profile.name)) {
          parsed.profile.name = 'Gabriel Santos';
        }
        if (parsed.settings && (parsed.settings.userName === 'Jéssica' || !parsed.settings.userName)) {
          parsed.settings.userName = 'Gabriel Santos';
        }
        // Garante que todas as chaves essenciais existam
        return {
          ...DEFAULT_DEMO_DATA,
          ...parsed,
          profile: { ...DEFAULT_DEMO_DATA.profile, ...(parsed.profile || {}) },
          settings: { ...DEFAULT_DEMO_DATA.settings, ...(parsed.settings || {}) },
          horizon25: { ...DEFAULT_DEMO_DATA.horizon25, ...(parsed.horizon25 || {}) }
        };
      }
    } catch (e) {
      console.error('Falha ao carregar dados do LocalStorage:', e);
    }
    // Primeira inicialização: salva dados demonstrativos
    this.saveData(DEFAULT_DEMO_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DEMO_DATA));
  }

  saveData(customData = null) {
    try {
      const toSave = customData || this.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      window.dispatchEvent(new CustomEvent('vesper:data-changed', { detail: { timestamp: Date.now() } }));
      return true;
    } catch (e) {
      console.error('Falha ao gravar no LocalStorage:', e);
      return false;
    }
  }

  save() {
    return this.saveData(this.data);
  }

  // Exportar backup completo em JSON
  exportJSON() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vesper_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importar backup JSON
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.goals || !parsed.diary) {
        throw new Error('Arquivo JSON inválido para a estrutura do Vésper.');
      }
      this.data = {
        ...DEFAULT_DEMO_DATA,
        ...parsed
      };
      this.save();
      return { success: true, message: 'Dados importados com sucesso!' };
    } catch (err) {
      return { success: false, message: 'Erro ao importar: ' + err.message };
    }
  }

  // Exportar relatórios em CSV com UTF-8 BOM
  exportCSV(type = 'metas') {
    let csvContent = '\uFEFF'; // UTF-8 BOM para abrir perfeitamente no Excel
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    if (type === 'metas') {
      csvContent += 'ID;Título;Área;Horizonte;Prioridade;Status;Progresso;Prazo;Descrição\n';
      this.data.goals.forEach(g => {
        csvContent += [
          escapeCsv(g.id),
          escapeCsv(g.title),
          escapeCsv(AREAS_DEFINITION[g.area]?.name || g.area),
          escapeCsv(g.horizon),
          escapeCsv(g.priority),
          escapeCsv(g.status),
          escapeCsv(`${g.progress}%`),
          escapeCsv(g.deadline || ''),
          escapeCsv(g.description || '')
        ].join(';') + '\n';
      });
    } else if (type === 'diario') {
      csvContent += 'Data;Título;Área;Descrição;Aprendizado;Dificuldade;Resultado;Reflexão\n';
      this.data.diary.forEach(d => {
        csvContent += [
          escapeCsv(d.date),
          escapeCsv(d.title),
          escapeCsv(AREAS_DEFINITION[d.area]?.name || d.area),
          escapeCsv(d.description),
          escapeCsv(d.learned || ''),
          escapeCsv(d.difficulty || ''),
          escapeCsv(d.result || ''),
          escapeCsv(d.reflection || '')
        ].join(';') + '\n';
      });
    } else if (type === 'experiencias') {
      csvContent += 'Data;Título;Área;Objetivo;O que foi feito;Aprendizado;O que faria diferente;Status\n';
      this.data.experiences.forEach(e => {
        csvContent += [
          escapeCsv(e.date || ''),
          escapeCsv(e.title),
          escapeCsv(AREAS_DEFINITION[e.area]?.name || e.area),
          escapeCsv(e.objective || ''),
          escapeCsv(e.whatWasDone || ''),
          escapeCsv(e.learned || ''),
          escapeCsv(e.whatToDoDifferently || ''),
          escapeCsv(e.status)
        ].join(';') + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vesper_${type}_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Restaurar dados de demonstração ou limpar
  resetData(blank = false) {
    if (blank) {
      this.data = {
        profile: {
          name: 'Usuário',
          subtitle: 'Personal Development System',
          horizonAge: 25,
          joinedDate: new Date().toISOString().slice(0, 10)
        },
        goals: [],
        diary: [],
        experiences: [],
        reviews: { weekly: [], monthly: [] },
        library: [],
        horizon25: {
          targetAge: 25,
          title: 'Horizonte 25 — Visão Estruturada',
          manifesto: '',
          letterToSelf: '',
          milestones: []
        },
        settings: {
          userName: 'Usuário',
          userRole: '',
          autoSave: true,
          compactView: false,
          installedDate: new Date().toISOString().slice(0, 10)
        }
      };
    } else {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DEMO_DATA));
    }
    this.save();
  }

  // Métodos de Metas (Goals)
  addGoal(goal) {
    const newGoal = {
      id: 'g-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
      history: [{ date: new Date().toISOString().slice(0, 10), text: 'Objetivo criado no sistema.' }],
      stages: [],
      progress: 0,
      status: 'nao_iniciado',
      ...goal
    };
    this.recalcGoalProgress(newGoal);
    this.data.goals.unshift(newGoal);
    this.save();
    return newGoal;
  }

  updateGoal(id, updates) {
    const index = this.data.goals.findIndex(g => g.id === id);
    if (index === -1) return null;
    const current = this.data.goals[index];
    const updated = { ...current, ...updates };
    
    // Adiciona ao histórico se o status mudou
    if (updates.status && updates.status !== current.status) {
      updated.history = updated.history || [];
      const statusLabels = {
        nao_iniciado: 'Não iniciado',
        em_andamento: 'Em andamento',
        concluido: 'Concluído',
        pausado: 'Pausado'
      };
      updated.history.push({
        date: new Date().toISOString().slice(0, 10),
        text: `Status alterado para: ${statusLabels[updates.status] || updates.status}`
      });
    }

    this.recalcGoalProgress(updated);
    this.data.goals[index] = updated;
    this.save();
    return updated;
  }

  toggleGoalStage(goalId, stageId) {
    const goal = this.data.goals.find(g => g.id === goalId);
    if (!goal || !goal.stages) return null;
    const stage = goal.stages.find(s => s.id === stageId);
    if (stage) {
      stage.done = !stage.done;
      this.recalcGoalProgress(goal);
      this.save();
    }
    return goal;
  }

  recalcGoalProgress(goal) {
    if (goal.stages && goal.stages.length > 0) {
      const completedCount = goal.stages.filter(s => s.done).length;
      goal.progress = Math.round((completedCount / goal.stages.length) * 100);
      if (goal.progress === 100 && goal.status !== 'concluido') {
        goal.status = 'concluido';
      } else if (goal.progress > 0 && goal.progress < 100 && goal.status === 'nao_iniciado') {
        goal.status = 'em_andamento';
      }
    }
  }

  deleteGoal(id) {
    this.data.goals = this.data.goals.filter(g => g.id !== id);
    this.save();
  }

  // Métodos de Diário (Diary)
  addDiaryEntry(entry) {
    const newEntry = {
      id: 'd-' + Date.now(),
      date: entry.date || new Date().toISOString().slice(0, 16),
      ...entry
    };
    this.data.diary.unshift(newEntry);
    this.save();
    return newEntry;
  }

  updateDiaryEntry(id, updates) {
    const index = this.data.diary.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.data.diary[index] = { ...this.data.diary[index], ...updates };
    this.save();
    return this.data.diary[index];
  }

  deleteDiaryEntry(id) {
    this.data.diary = this.data.diary.filter(d => d.id !== id);
    this.save();
  }

  // Métodos de Experiências (Experiences)
  addExperience(exp) {
    const newExp = {
      id: 'e-' + Date.now(),
      date: exp.date || new Date().toISOString().slice(0, 10),
      status: exp.status || 'planejada',
      ...exp
    };
    this.data.experiences.unshift(newExp);
    this.save();
    return newExp;
  }

  updateExperience(id, updates) {
    const index = this.data.experiences.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.experiences[index] = { ...this.data.experiences[index], ...updates };
    this.save();
    return this.data.experiences[index];
  }

  deleteExperience(id) {
    this.data.experiences = this.data.experiences.filter(e => e.id !== id);
    this.save();
  }

  // Métodos de Revisões (Reviews)
  addReview(type, review) {
    const newReview = {
      id: 'r' + (type === 'weekly' ? 'w' : 'm') + '-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      ...review
    };
    if (!this.data.reviews[type]) {
      this.data.reviews[type] = [];
    }
    this.data.reviews[type].unshift(newReview);
    this.save();
    return newReview;
  }

  deleteReview(type, id) {
    if (this.data.reviews[type]) {
      this.data.reviews[type] = this.data.reviews[type].filter(r => r.id !== id);
      this.save();
    }
  }

  // Métodos de Biblioteca (Library)
  addLibraryItem(item) {
    const newItem = {
      id: 'lib-' + Date.now(),
      rating: 5,
      status: 'planejado',
      ...item
    };
    this.data.library.unshift(newItem);
    this.save();
    return newItem;
  }

  updateLibraryItem(id, updates) {
    const index = this.data.library.findIndex(l => l.id === id);
    if (index === -1) return null;
    this.data.library[index] = { ...this.data.library[index], ...updates };
    this.save();
    return this.data.library[index];
  }

  deleteLibraryItem(id) {
    this.data.library = this.data.library.filter(l => l.id !== id);
    this.save();
  }

  // Horizonte 25
  saveHorizon25(horizonData) {
    this.data.horizon25 = {
      ...this.data.horizon25,
      ...horizonData
    };
    this.save();
    return this.data.horizon25;
  }

  // Configurações
  saveSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    if (settings.userName) {
      this.data.profile.name = settings.userName;
    }
    if (settings.userRole) {
      this.data.profile.subtitle = settings.userRole;
    }
    this.save();
  }
}

window.AREAS_DEFINITION = AREAS_DEFINITION;
window.vesperStorage = new VesperStorage();
