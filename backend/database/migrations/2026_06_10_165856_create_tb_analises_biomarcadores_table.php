<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_analises_biomarcadores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('tb_usuarios')->onDelete('cascade');

            // Inputs do usuário (biomarcadores)
            $table->float('horas_sono')->nullable();
            $table->float('nivel_glicose')->nullable();           // mg/dL
            $table->float('frequencia_cardiaca_hrv')->nullable(); // ms (variabilidade)
            $table->float('pressao_sistolica')->nullable();       // mmHg
            $table->float('pressao_diastolica')->nullable();      // mmHg
            $table->float('temperatura_corporal')->nullable();    // °C
            $table->float('saturacao_oxigenio')->nullable();      // % (SpO2)
            $table->text('observacoes')->nullable();               // notas livres do usuário

            // Resultado da IA
            $table->text('prompt_enviado')->nullable();
            $table->text('resposta_ia')->nullable();
            $table->string('modelo_ia', 50)->nullable();          // ex: gemini-pro

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_analises_biomarcadores');
    }
};
