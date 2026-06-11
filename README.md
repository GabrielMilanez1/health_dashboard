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

---

## 🤖 Uso de Inteligência Artificial

Este projeto foi desenvolvido com o auxílio de ferramentas de IA.

### Docker
- O container Docker foi gerado **exclusivamente pela IA**, seguindo os requisitos e regras definidos previamente.

### Back-end (Laravel)
- Toda a **arquitetura e estrutura de pastas** do projeto foi desenhada manualmente, incluindo a aplicação do **princípio de responsabilidade única (SRP)**, dividindo o projeto em camadas bem definidas: **Models, Repositories, Controllers e Services**.
- A IA foi utilizada apenas como um **escritor de código**, atuando sob orientação direta para otimizar o tempo de entrega, sem interferir nas decisões arquiteturais.

### Front-end (React Native / Expo)
- Foi definido um **esboço/wireframe** de como a interface deveria ser, e a IA desenvolveu toda a **estrutura e código** do front-end com base nesse direcionamento.

### Testes
- Os testes foram **gerados pela IA**, tendo como base as rotas da aplicação fornecidas como contexto.
