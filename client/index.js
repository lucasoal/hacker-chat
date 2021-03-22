// RESPONSAVEL POR CHAMAR TODOS OS MÓDULOS DO SISTEMA

// IMPORTA CALSSE ENVENTS DO NODEJS
import Events from 'events';

// IMPORTA TerminalController
import TerminalController from "./src/terminalController.js";

// CRIANDO OBJETO QUE SERÁ O COMPONENT EMITTER DO CONTROLLER
// NAVEGA ENTRE A CAMADA CONTROLADORA E AS OUTRAS
const componentEmitter = new Events();

// INICIALIZANDO TerminalController
const controller = new TerminalController()

await controller.initializeTable(componentEmitter);
