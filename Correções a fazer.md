Backend
corrigir erros/ exception dentro e fora da base de dados (ex: quando há delete de uma battery associada a um prosumer)
corrigir create do profile (simulation e prosumer enviados por parametro)
corrigir create e mappers do simulation (community enviado por parametro)
corrigir o data do simulation
*integrar a deleção da simulation com a deleção dos profiles

uniformizar os pedidos nas routes

frontend
Corrigir refresh e navegações 
corrigir erro das secure routes no login 
corrigir barras de busca e botões de organização na tabelas

adicionar opção de editar visulizar e eliminar simulation
adicionar botões de info para os formatos dos ficheiros e para as datas disponíveis para cada ficheiro
adicionar alertas para a desconexão com o backend e vice versa
*adicionar numeração dos profiles de uma simulation
parar a procura de entidades quando a lista é vazia.



criar componente que gera o icon da bandeira recebendo o tamanho e o código do país

repensar a lógica de visualização de dados analíticos dos prosumers (o manager tem acesso a todas as communidades?)



Futuro:
- descrever como cada operação acontece (create delete update) e que impacto tem na base de dados (foreign keys)
- corrigir e criar mais  testes
- Histórico de alterações (communities, prosumers, batteries, etc.)
- Página para gestão de users
- Geração de relatórios de dados
- Comparação de dados antes e depois da otimização