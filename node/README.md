# Backend

Crie um arquivo `.env` a partir do `.env.example`:
```
cp server/.env.example server/.env
```

Coloque sua Alpha Vantage API KEY nele.
Depois, basta entrar na pasta `server` e iniciar a aplicação com:
```
yarn start
```
A aplicação será iniciado em: http://localhost:3001

---

Para rodar todos os testes você pode usar o comando:
```
yarn test:coverage
```

### Observações:  
Fiz uma pequena alteração no endpoint `/stocks/:stock_name/compare`. As ações que vão ser comparadas são enviado por `query params` ao invés do `body`

Exemplo de uso:  
`/stocks/IBM/compare?stocksToCompare[]=AAPL&stocksToCompare[]=PETR4.SA`


# Frontend

No front eu usei ReactJS.
Para iniciar a aplicação basta entrar na pasta `client` e executar:
```
yarn start
```
A aplicação será servida em http://localhost:3000

> TENHA CERTEZA DE TER INICIADO O BACKEND ANTES.

---

Para rodar todos os testes você pode usar o comando:
```
yarn test:coverage
```