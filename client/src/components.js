// CLASSE RESPONSÁVEL POR CONSTRUIR O LAYOUT SOB DEMANDA

// IMPORTA O BLESSED PARA REALIZAR A INTERFACE
import blessed from 'blessed'

// CRIA CLASSE
export default class ComponentsBuilder {

    // COMPONENTE PRIVADO
    #screen
    #layout
    #input

    constructor() { }

    // METODO QUE RETORNA AS PROPRIEDADES PARA CRIAR UM COMPONENTE
    // # -> COMPONENTE PRIVADO
    #baseComponent() {
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollbar: {
                ch: ' ',
                inverse: true
            },
            // HABILITA CORES E TAGS NO TEXTO
            tags: true,
        }
    }
    // RETORNA A TELA
    setScreen({ title }) {
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        })
        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0)) // PARA O PROGRAMA

        return this
    }
    // JANELAS DA TELA
    setLayoutComponent() {
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%', height: '100%'
        })
        return this
    }

    setInputComponent(onEnterPressed) {
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0, height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1, 
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        })

        input.key('enter', onEnterPressed); // QUANDO DIGITAR ENTER
        this.#input = input

        return this
    }

    // CRIAR METODO BUILD
    // MOSTRA A TELA E O INPUT
    build() {
        const components = {
            screen: this.#screen,
            input: this.#input,
        }

        return components
    }
}

