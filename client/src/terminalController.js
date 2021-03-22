// RECEBER REGRAS DE NEGOCIO E DELEGAR EVENTOS

// IMPORTA OS COMPONENTES
import ComponentsBuilder from "./components.js";

export default class TerminalController {

    constructor() { }

    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }

    // START DO PROJETO
    // RECEBE O EMISSOR DE EVENTOS DO NODEJS PARA GERENCIAR OS EVENTOS
    async initializeTable(eventEmitter) {

        const components = new ComponentsBuilder()
            .setScreen({ title: 'HackerChat - Erick Wendel' })
            // MOSTRA AS JANELAS
            .setLayoutComponent()
            // DEFINE A AREA DE ENTRADA DO TEXTO
            // AO DIGITAR ENTER, IMPRIME NA TELA O RESULTADO
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .build()

        // AO INICIALIZAR O TERMINAL, O FOCO VAI PARA O INPUT
        components.input.focus();
        // RENDERIZAR A TELA
        components.screen.render();
    }
}