# Health Dashboard

Antes de buildar o container, devem ser preenchidos os dados no arquivo `.env` da raiz, incluindo a chave de API do Groq.

O banco MySQL do container está setado para utilizar a porta **3307** da máquina, e não a 3306 como é o padrão.

Na raiz do projeto:
```bash
docker compose up -d --build
```
> Depois de iniciado, pode levar até 20 segundos para que todos os serviços funcionem.

Para rodar o app (a primeira vez demora alguns minutos pra fazer o build):
```bash
ELECTRON_DISABLE_SANDBOX=1 npx expo run:android
```
