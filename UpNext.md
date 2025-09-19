Next steps:
- Define and describe the iputs and outputs of the optimization algorithm (so the user can understand the data, and have an idea of what the input file must have);

- Create a funcionality to set to zero the deactivated data before the optimization;

- Add the before and after community belonging of the prosumer data;

- Add the coeficient description; 

Description:

    a manipulação do intervalo de tempo dos dados deve ser feita no frontend ou backend?

    Otimização:
    corrigir erro do dicionário

    Backend
    substituir a validação da existencia de entidades pelo find pela validação por exists
    Remover os includes desnecessários dos metodos find no repo (ex include community no Find dos profiles)
    adicionar mais logs a descrever o load dos profiles 
    _fazer o upload dos dados diretamente para a base de dados (FastApi para Postgress)_
    mover os dtos para um só ficheiro?
    criar entidade stats
    converter strings para float no schema e nas entidades
    corrigir erros/ exception dentro e fora da base de dados (ex: quando há delete de uma battery associada a um prosumer)
    corrigir codigos de sucesso ou insucesso no controller
    corrigir create do profile (simulation e prosumer enviados por parametro)
    corrigir create e mappers do simulation (community enviado por parametro)
    corrigir o data do simulation
    *integrar a deleção da simulation com a deleção dos profiles

    uniformizar os pedidos nas routes
    caso haja algum erro na criação de profiles a simulation deve ser apagada 

    frontend
    melhorar a descrição dos prosumers na dashboard
    melhorar a descrição das simulations ao carregar no show
    apresentar o numero de profiles no show da simulation
    Corrigir a forma como se obtem profiles no dashboard
    corrigir a seleção/ de seleção dos atributos do profile analitics
    !! Adicionar uma comparação do load e consumo do prosumer antes e após pertencer à comunidade
    corrigir a lista de prosumers na comparação de uma comunidade (prosumers repetidos)
    Corrigir refresh e navegações 
    corrigir erro das secure routes no login 
    corrigir barras de busca e botões de organização na tabelas
    corrigir as buscas dos prosumers a adicionar numa communidade
    corrigir o erro do algoritmo de otimização

    adicionar botões de info para os formatos dos ficheiros e para as datas disponíveis para cada ficheiro
    adicionar alertas para a desconexão com o backend e vice versa
    *adicionar numeração dos profiles de uma simulatiomn
    adicionar scroll para aumentar ou diminuir os intervalos de datas
    adicionar componente skeleton para aparecer enquanto a página carrega
    parar a procura de entidades quando a lista é vazia.



    criar componente que gera o icon da bandeira recebendo o tamanho e o código do país

    repensar a lógica de visualização de dados analíticos dos prosumers (o manager tem acesso a todas as communidades?)
    criar ui para gestão de utilizadores (admin)



    Futuro:
    - adicionar os logs do terminal no frontend (websocket)
    - ponderar dashboards que representam valores monetários das energias 
    - descrever como cada operação acontece (create delete update) e que impacto tem na base de dados (foreign keys)
    - corrigir e criar mais  testes 
    - Histórico de alterações (communities, prosumers, batteries, etc.) 
    - Página para gestão de users
    - Geração de relatórios de dados
    - Comparação de dados antes e depois da otimização

    Dúvidas:
    - Deve existir um tipo de get para cada função do frontend (ex lista de simulations sem os stributos para evitar overhead)