



# Optimization Algorithm API

To run the module

**1º:** ```pip install fastapi uvicorn python-multipart pandas openpyxl xlsxwriter```
**2º:** ```uvicorn main:app --reload```

Endpoint: POST http://localhost:8000/optimize

Aceita: ficheiro Excel (.xlsx)

Retorna: ficheiro Excel com os resultados

## Receção do Ficheiro:

O endpoint /optimize/ usa UploadFile do FastAPI para receber o ficheiro Excel.

O ficheiro é guardado no diretório temp.

## Execução do Algoritmo:

A função run_optimization(input_file_path, output_file_path) encapsula o algoritmo (por exemplo, leitura do Excel, processamento dos dados, e escrita dos resultados em um novo Excel).

Em caso de erro, um HTTPException é disparado, comunicando a falha ao backend Node.js.

## Resposta:

Após o processamento, a API retorna um JSON com uma mensagem de sucesso e o caminho (ou nome) do ficheiro gerado no diretório results.

Se necessário, pode ser exposto um endpoint adicional para download do ficheiro.

Interligação com o Backend Node.js:

O backend Node.js pode chamar esse endpoint usando uma biblioteca HTTP (como Axios) para enviar o ficheiro Excel e aguardar a resposta.

Após receber o resultado, o backend poderá persistir os dados na base Postgres (usando Prisma) ou disponibilizá-los via front-end.
