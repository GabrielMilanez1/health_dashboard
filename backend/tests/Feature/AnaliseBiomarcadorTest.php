<?php

namespace Tests\Feature;

use App\Models\Usuario;
use App\Models\AnaliseBiomarcador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AnaliseBiomarcadorTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $usuario;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->usuario = Usuario::create([
            'nome'  => 'Teste',
            'email' => 'teste@healthdashboard.com',
            'senha' => bcrypt('12345678'),
        ]);

        $this->token = JWTAuth::fromUser($this->usuario);
    }

    /**
     * Testa que o endpoint rejeita requests sem token.
     */
    public function test_analise_requer_autenticacao(): void
    {
        $response = $this->postJson('/api/analise', [
            'horas_sono' => 7,
        ]);

        $response->assertStatus(401);
    }

    /**
     * Testa que o endpoint cria uma análise com dados válidos.
     */
    public function test_criar_analise_com_dados_validos(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/analise', [
                'horas_sono'              => 6.5,
                'nivel_glicose'           => 110,
                'frequencia_cardiaca_hrv' => 35,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'analise' => [
                    'id',
                    'usuario_id',
                    'horas_sono',
                    'nivel_glicose',
                    'frequencia_cardiaca_hrv',
                ],
                'resultado' => [
                    'sucesso',
                    'resposta',
                    'erro',
                ],
            ]);

        $this->assertDatabaseHas('tb_analises_biomarcadores', [
            'usuario_id'              => $this->usuario->id,
            'horas_sono'              => 6.5,
            'nivel_glicose'           => 110,
            'frequencia_cardiaca_hrv' => 35,
        ]);
    }

    /**
     * Testa que o endpoint rejeita dados inválidos.
     */
    public function test_rejeita_dados_invalidos(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/analise', [
                'horas_sono' => 25, // max é 24
                'nivel_glicose' => -10, // min é 0
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['horas_sono', 'nivel_glicose']);
    }

    /**
     * Testa que o histórico retorna apenas análises do usuário autenticado.
     */
    public function test_listar_analises_do_usuario(): void
    {
        AnaliseBiomarcador::create([
            'usuario_id' => $this->usuario->id,
            'horas_sono' => 8,
        ]);

        $outroUsuario = Usuario::create([
            'nome'  => 'Outro',
            'email' => 'outro@test.com',
            'senha' => bcrypt('12345678'),
        ]);

        AnaliseBiomarcador::create([
            'usuario_id' => $outroUsuario->id,
            'horas_sono' => 5,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/analises');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }
}
