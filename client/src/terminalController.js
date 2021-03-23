// RECEBER REGRAS DE NEGOCIO E DELEGAR EVENTOS

// IMPORTA OS COMPONENTES
import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {

    #usersCollors = new Map()

    constructor() { }

    #pickCollor() {
        return `#` + ((1 << 24) * Math.random() | 0).toString(16) + `-fg`
    }

    // METODO PARA GERENCIAR COR DO TEXTO PELO NOME DO USUÁRIO
    // SE O USERS COLLORS JA TIVER UMA COR, RETORNA A COR DELE
    // CASO NAO TENHA A COR, O USUÁRIO RECEBE UMA COR 
    #getUserColor(userName) {
        if (this.#usersCollors.has(userName))
            return this.#usersCollors.get(userName)

        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)

        return collor
    }

    #onInputReceived(eventEmitter) {
        return function () {
            // mesasge RECEBE A MENSAGEM ESCRITA PELO USUÁRIOS
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }

    // QUANDO UMA MENSAGEM FOR RECEBIDA
    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg
            const collor = this.#getUserColor(userName)
            chat.addItem(`{${collor}}{bold} ${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {

            const [userName] = msg.split(/\s/)
            const collor = this.#getUserColor(userName)
            activityLog.addItem(`{${collor}}{bold} ${msg.toString()}{/}}`)

            screen.render()
        }
    }

    #onStatusChanged({ screen, status }) {

        return users => {

            // PEGAR O PRIMEIRO ELEMENTO DA LISTA
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)

            users.forEach(userName => {
                const collor = this.#getUserColor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            })

            screen.render()
        }
    }

    #registerEvents(eventEmitter, components) {
        // eventEmitter.emit('turma01', 'hey') // ENVIA INFOS
        // eventEmitter.on('turma01', msg => console.log(msg.toString())) // RECEBE INFOS

        // QUANDO UMA MENSAGEM FOR RECEBIDA
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))

    }

    // START DO PROJETO
    // RECEBE O EMISSOR DE EVENTOS DO NODEJS PARA GERENCIAR OS EVENTOS
    async initializeTable(eventEmitter) {

        const components = new ComponentsBuilder()
            .setScreen({ title: 'Tchat - by @lucas_oal' })
            // MOSTRA AS JANELAS
            .setLayoutComponent()
            // DEFINE A AREA DE ENTRADA DO TEXTO
            // AO DIGITAR ENTER, IMPRIME NA TELA O RESULTADO
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent() // QUADRO DO CHAT
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        // AO INICIALIZAR O TERMINAL, O FOCO VAI PARA O INPUT
        components.input.focus();
        // RENDERIZAR A TELA
        components.screen.render();


        setInterval(() => {

        eventEmitter.emit('activityLog:updated', '@lucas_oal join')
        eventEmitter.emit('message:received', { message: 'hello', userName: '@lucas_oal' })
        eventEmitter.emit('activityLog:updated', '@jsojo_charmosa join')
        eventEmitter.emit('message:received', { message: 'hey', userName: '@jojo_charmosa' })
        eventEmitter.emit('activityLog:updated', '@lucas_oal left')
        eventEmitter.emit('activityLog:updated', '@jojo_charmosa left')

        const users = ['@lucas_oal']
        eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        users.push('@jojo_charmosa')
        eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        users.push('@maricota', '@tililo')
        eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        users.push('@boy', '@gerald')
        eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)


        }, 2000)

    }
}