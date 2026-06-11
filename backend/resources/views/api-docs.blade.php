<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Dashboard — API Docs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12121a;
            --bg-card: #16161f;
            --bg-code: #1a1a26;
            --border: #2a2a3a;
            --border-hover: #3a3a4f;
            --text-primary: #e8e8ed;
            --text-secondary: #9898a8;
            --text-muted: #6868788;
            --accent-green: #34d399;
            --accent-green-dim: rgba(52, 211, 153, 0.12);
            --accent-blue: #60a5fa;
            --accent-blue-dim: rgba(96, 165, 250, 0.12);
            --accent-amber: #fbbf24;
            --accent-amber-dim: rgba(251, 191, 36, 0.12);
            --accent-red: #f87171;
            --accent-red-dim: rgba(248, 113, 113, 0.12);
            --accent-purple: #a78bfa;
            --accent-purple-dim: rgba(167, 139, 250, 0.12);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        /* ---- Header ---- */
        .header {
            border-bottom: 1px solid var(--border);
            padding: 2rem 0;
            background: linear-gradient(180deg, rgba(96, 165, 250, 0.04) 0%, transparent 100%);
        }
        .header-inner {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .header-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: var(--accent-green-dim);
            color: var(--accent-green);
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.3rem 0.75rem;
            border-radius: 100px;
            margin-bottom: 1rem;
            letter-spacing: 0.03em;
        }
        .header-badge::before {
            content: '';
            width: 6px;
            height: 6px;
            background: var(--accent-green);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        .header h1 {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            margin-bottom: 0.35rem;
        }
        .header p {
            color: var(--text-secondary);
            font-size: 1rem;
        }
        .base-url {
            display: inline-block;
            margin-top: 1rem;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 0.85rem;
            background: var(--bg-code);
            border: 1px solid var(--border);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            color: var(--accent-blue);
        }

        /* ---- Main ---- */
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* ---- Section ---- */
        .section {
            margin-bottom: 3rem;
        }
        .section-title {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-secondary);
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border);
        }

        /* ---- Endpoint Card ---- */
        .endpoint {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            margin-bottom: 1rem;
            transition: border-color 0.2s;
            overflow: hidden;
        }
        .endpoint:hover { border-color: var(--border-hover); }

        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            cursor: pointer;
            user-select: none;
        }
        .endpoint-header:hover { background: rgba(255,255,255,0.015); }

        .method {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            font-weight: 700;
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            letter-spacing: 0.04em;
            min-width: 52px;
            text-align: center;
        }
        .method-get { background: var(--accent-green-dim); color: var(--accent-green); }
        .method-post { background: var(--accent-blue-dim); color: var(--accent-blue); }
        .method-put { background: var(--accent-amber-dim); color: var(--accent-amber); }
        .method-delete { background: var(--accent-red-dim); color: var(--accent-red); }

        .endpoint-path {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: var(--text-primary);
        }
        .endpoint-desc {
            margin-left: auto;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
        .endpoint-lock {
            font-size: 0.85rem;
            opacity: 0.5;
            title: "Autenticação necessária";
        }

        .endpoint-body {
            display: none;
            padding: 0 1.25rem 1.25rem;
            border-top: 1px solid var(--border);
        }
        .endpoint.open .endpoint-body { display: block; }
        .endpoint.open .endpoint-chevron { transform: rotate(90deg); }

        .endpoint-chevron {
            color: var(--text-secondary);
            font-size: 0.65rem;
            transition: transform 0.2s;
            margin-left: -0.25rem;
        }

        /* ---- Code Blocks ---- */
        .code-label {
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-secondary);
            margin: 1rem 0 0.4rem;
        }
        pre {
            background: var(--bg-code);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1rem;
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            line-height: 1.7;
            color: var(--text-primary);
        }
        .json-key { color: var(--accent-blue); }
        .json-string { color: var(--accent-green); }
        .json-number { color: var(--accent-amber); }
        .json-null { color: var(--accent-red); font-style: italic; }

        /* ---- Auth Info ---- */
        .auth-note {
            display: flex;
            align-items: flex-start;
            gap: 0.6rem;
            background: var(--accent-purple-dim);
            border: 1px solid rgba(167, 139, 250, 0.2);
            border-radius: 8px;
            padding: 0.85rem 1rem;
            margin-bottom: 1.5rem;
            font-size: 0.82rem;
            color: var(--accent-purple);
            line-height: 1.5;
        }
        .auth-note code {
            font-family: 'JetBrains Mono', monospace;
            background: rgba(167, 139, 250, 0.12);
            padding: 0.15rem 0.4rem;
            border-radius: 4px;
            font-size: 0.78rem;
        }

        /* ---- Status Codes ---- */
        .status-row {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            margin-top: 0.35rem;
            font-size: 0.8rem;
        }
        .status-code {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.15rem 0.45rem;
            border-radius: 4px;
        }
        .status-2xx { background: var(--accent-green-dim); color: var(--accent-green); }
        .status-4xx { background: var(--accent-amber-dim); color: var(--accent-amber); }

        /* ---- Footer ---- */
        .footer {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
            font-size: 0.78rem;
            border-top: 1px solid var(--border);
        }

        /* ---- Responsive ---- */
        @media (max-width: 640px) {
            .endpoint-desc { display: none; }
            .header h1 { font-size: 1.5rem; }
        }
    </style>
</head>
<body>

<header class="header">
    <div class="header-inner">
        <div class="header-badge">ONLINE</div>
        <h1>Health Dashboard API</h1>
        <p>Documentação dos endpoints da API REST</p>
        <div class="base-url">{{ url('/api') }}</div>
    </div>
</header>

<main class="container">

    {{-- Auth note --}}
    <div class="auth-note">
        <span>🔒</span>
        <div>
            Endpoints protegidos requerem o header
            <code>Authorization: Bearer &lt;token&gt;</code>
            obtido via login ou registro.
        </div>
    </div>

    {{-- ============================================================ --}}
    {{-- PÚBLICO --}}
    {{-- ============================================================ --}}
    <section class="section">
        <div class="section-title">Público</div>

        {{-- Health --}}
        <div class="endpoint">
            <div class="endpoint-header">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-get">GET</span>
                <span class="endpoint-path">/api/health</span>
                <span class="endpoint-desc">Health check</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Resposta 200</div>
                <pre>{
    <span class="json-key">"status"</span>: <span class="json-string">"ok"</span>,
    <span class="json-key">"timestamp"</span>: <span class="json-string">"2026-06-11T12:00:00Z"</span>
}</pre>
            </div>
        </div>

        {{-- Register --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-post">POST</span>
                <span class="endpoint-path">/api/auth/register</span>
                <span class="endpoint-desc">Criar conta</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Body (JSON)</div>
                <pre>{
    <span class="json-key">"nome"</span>: <span class="json-string">"João Silva"</span>,
    <span class="json-key">"email"</span>: <span class="json-string">"joao@email.com"</span>,
    <span class="json-key">"senha"</span>: <span class="json-string">"minhasenha123"</span>,
    <span class="json-key">"telefone"</span>: <span class="json-string">"11999998888"</span>,
    <span class="json-key">"data_nascimento"</span>: <span class="json-string">"1995-03-15"</span>,
    <span class="json-key">"tipo_sanguineo"</span>: <span class="json-string">"O+"</span>
}</pre>
                <div class="code-label">Resposta 201</div>
                <pre>{
    <span class="json-key">"message"</span>: <span class="json-string">"Usuário criado com sucesso."</span>,
    <span class="json-key">"usuario"</span>: { <span class="json-key">"id"</span>: <span class="json-number">1</span>, <span class="json-key">"nome"</span>: <span class="json-string">"João Silva"</span>, ... },
    <span class="json-key">"token"</span>: <span class="json-string">"eyJ0eXAiOiJKV1Q..."</span>,
    <span class="json-key">"tipo"</span>: <span class="json-string">"Bearer"</span>
}</pre>
                <div class="status-row">
                    <span class="status-code status-2xx">201</span> Criado com sucesso
                </div>
                <div class="status-row">
                    <span class="status-code status-4xx">422</span> Validação falhou
                </div>
            </div>
        </div>

        {{-- Login --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-post">POST</span>
                <span class="endpoint-path">/api/auth/login</span>
                <span class="endpoint-desc">Autenticar</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Body (JSON)</div>
                <pre>{
    <span class="json-key">"email"</span>: <span class="json-string">"joao@email.com"</span>,
    <span class="json-key">"senha"</span>: <span class="json-string">"minhasenha123"</span>
}</pre>
                <div class="code-label">Resposta 200</div>
                <pre>{
    <span class="json-key">"message"</span>: <span class="json-string">"Login realizado com sucesso."</span>,
    <span class="json-key">"usuario"</span>: { <span class="json-key">"id"</span>: <span class="json-number">1</span>, <span class="json-key">"nome"</span>: <span class="json-string">"João Silva"</span>, ... },
    <span class="json-key">"token"</span>: <span class="json-string">"eyJ0eXAiOiJKV1Q..."</span>,
    <span class="json-key">"tipo"</span>: <span class="json-string">"Bearer"</span>
}</pre>
                <div class="status-row">
                    <span class="status-code status-2xx">200</span> Autenticado
                </div>
                <div class="status-row">
                    <span class="status-code status-4xx">401</span> Credenciais inválidas
                </div>
            </div>
        </div>
    </section>

    {{-- ============================================================ --}}
    {{-- AUTENTICADO — AUTH --}}
    {{-- ============================================================ --}}
    <section class="section">
        <div class="section-title">Autenticação (protegido) 🔒</div>

        {{-- Me --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-get">GET</span>
                <span class="endpoint-path">/api/auth/me</span>
                <span class="endpoint-desc">Dados do usuário logado</span>
                <span class="endpoint-lock">🔒</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Resposta 200</div>
                <pre>{
    <span class="json-key">"id"</span>: <span class="json-number">1</span>,
    <span class="json-key">"nome"</span>: <span class="json-string">"João Silva"</span>,
    <span class="json-key">"email"</span>: <span class="json-string">"joao@email.com"</span>,
    <span class="json-key">"telefone"</span>: <span class="json-string">"11999998888"</span>,
    <span class="json-key">"data_nascimento"</span>: <span class="json-string">"1995-03-15T00:00:00.000000Z"</span>,
    <span class="json-key">"tipo_sanguineo"</span>: <span class="json-string">"O+"</span>,
    <span class="json-key">"created_at"</span>: <span class="json-string">"2026-06-11T12:00:00.000000Z"</span>,
    <span class="json-key">"updated_at"</span>: <span class="json-string">"2026-06-11T12:00:00.000000Z"</span>
}</pre>
                <div class="status-row">
                    <span class="status-code status-4xx">401</span> Não autenticado
                </div>
            </div>
        </div>

        {{-- Logout --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-post">POST</span>
                <span class="endpoint-path">/api/auth/logout</span>
                <span class="endpoint-desc">Encerrar sessão</span>
                <span class="endpoint-lock">🔒</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Resposta 200</div>
                <pre>{
    <span class="json-key">"message"</span>: <span class="json-string">"Logout realizado com sucesso."</span>
}</pre>
            </div>
        </div>

        {{-- Refresh --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-post">POST</span>
                <span class="endpoint-path">/api/auth/refresh</span>
                <span class="endpoint-desc">Renovar token</span>
                <span class="endpoint-lock">🔒</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Resposta 200</div>
                <pre>{
    <span class="json-key">"token"</span>: <span class="json-string">"eyJ0eXAiOiJKV1Q..."</span>,
    <span class="json-key">"tipo"</span>: <span class="json-string">"Bearer"</span>
}</pre>
            </div>
        </div>
    </section>

    {{-- ============================================================ --}}
    {{-- AUTENTICADO — ANÁLISES --}}
    {{-- ============================================================ --}}
    <section class="section">
        <div class="section-title">Análise de Biomarcadores (protegido) 🔒</div>

        {{-- Criar Análise --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-post">POST</span>
                <span class="endpoint-path">/api/analise</span>
                <span class="endpoint-desc">Submeter biomarcadores</span>
                <span class="endpoint-lock">🔒</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Body (JSON)</div>
                <pre>{
    <span class="json-key">"biomarcadores"</span>: {
        <span class="json-key">"glicose"</span>: <span class="json-number">95</span>,
        <span class="json-key">"colesterol_total"</span>: <span class="json-number">180</span>,
        <span class="json-key">"hdl"</span>: <span class="json-number">55</span>,
        <span class="json-key">"ldl"</span>: <span class="json-number">100</span>,
        <span class="json-key">"triglicerideos"</span>: <span class="json-number">120</span>,
        <span class="json-key">"hemoglobina"</span>: <span class="json-number">14.5</span>,
        <span class="json-key">"leucocitos"</span>: <span class="json-number">7500</span>,
        <span class="json-key">"plaquetas"</span>: <span class="json-number">250000</span>,
        <span class="json-key">"creatinina"</span>: <span class="json-number">0.9</span>,
        <span class="json-key">"ureia"</span>: <span class="json-number">30</span>,
        <span class="json-key">"tgo"</span>: <span class="json-number">25</span>,
        <span class="json-key">"tgp"</span>: <span class="json-number">28</span>,
        <span class="json-key">"tsh"</span>: <span class="json-number">2.5</span>,
        <span class="json-key">"vitamina_d"</span>: <span class="json-number">35</span>,
        <span class="json-key">"vitamina_b12"</span>: <span class="json-number">450</span>
    }
}</pre>
                <div class="code-label">Resposta 201</div>
                <pre>{
    <span class="json-key">"message"</span>: <span class="json-string">"Análise criada com sucesso."</span>,
    <span class="json-key">"analise"</span>: {
        <span class="json-key">"id"</span>: <span class="json-number">1</span>,
        <span class="json-key">"interpretacao"</span>: <span class="json-string">"Seus resultados indicam..."</span>,
        ...
    }
}</pre>
                <div class="status-row">
                    <span class="status-code status-2xx">201</span> Análise criada
                </div>
                <div class="status-row">
                    <span class="status-code status-4xx">422</span> Validação falhou
                </div>
            </div>
        </div>

        {{-- Listar Análises --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-get">GET</span>
                <span class="endpoint-path">/api/analises</span>
                <span class="endpoint-desc">Listar histórico</span>
                <span class="endpoint-lock">🔒</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Resposta 200</div>
                <pre>[
    {
        <span class="json-key">"id"</span>: <span class="json-number">1</span>,
        <span class="json-key">"interpretacao"</span>: <span class="json-string">"Seus resultados indicam..."</span>,
        <span class="json-key">"created_at"</span>: <span class="json-string">"2026-06-11T12:00:00.000000Z"</span>,
        ...
    }
]</pre>
            </div>
        </div>

        {{-- Buscar Análise --}}
        <div class="endpoint">
            <div class="endpoint-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="endpoint-chevron">▶</span>
                <span class="method method-get">GET</span>
                <span class="endpoint-path">/api/analise/{id}</span>
                <span class="endpoint-desc">Detalhes de uma análise</span>
                <span class="endpoint-lock">🔒</span>
            </div>
            <div class="endpoint-body">
                <div class="code-label">Resposta 200</div>
                <pre>{
    <span class="json-key">"id"</span>: <span class="json-number">1</span>,
    <span class="json-key">"usuario_id"</span>: <span class="json-number">1</span>,
    <span class="json-key">"biomarcadores"</span>: { ... },
    <span class="json-key">"interpretacao"</span>: <span class="json-string">"Seus resultados indicam..."</span>,
    <span class="json-key">"created_at"</span>: <span class="json-string">"2026-06-11T12:00:00.000000Z"</span>
}</pre>
                <div class="status-row">
                    <span class="status-code status-2xx">200</span> Encontrada
                </div>
                <div class="status-row">
                    <span class="status-code status-4xx">404</span> Análise não encontrada
                </div>
            </div>
        </div>
    </section>
</main>

<footer class="footer">
    Health Dashboard API &bull; Laravel {{ app()->version() }} &bull; PHP {{ phpversion() }}
</footer>

<script nonce="{{ $cspNonce }}">
    document.querySelectorAll('.endpoint-header').forEach(function(header) {
        header.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
    // Open first endpoint by default
    document.querySelector('.endpoint')?.classList.add('open');
</script>

</body>
</html>
