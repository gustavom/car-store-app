(function ($) {
    'use strict';

    /*
    Vamos estruturar um pequeno app utilizando módulos.
    Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
    A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
    seguinte forma:
    - No início do arquivo, deverá ter as informações da sua empresa - nome e
    telefone (já vamos ver como isso vai ser feito)
    - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
    um formulário para cadastro do carro, com os seguintes campos:
      - Imagem do carro (deverá aceitar uma URL)
      - Marca / Modelo
      - Ano
      - Placa
      - Cor
      - e um botão "Cadastrar"

    Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
    carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
    aparecer no final da tabela.

    Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
    empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
    Dê um nome para a empresa e um telefone fictício, preechendo essas informações
    no arquivo company.json que já está criado.

    Essas informações devem ser adicionadas no HTML via Ajax.

    Parte técnica:
    Separe o nosso módulo de DOM criado nas últimas aulas em
    um arquivo DOM.js.

    E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
    que será nomeado de "app".
    */
    var app = (function appControler() {
        var $carRegisterNumber = 0;
        return {


            init: function () {
                this.companyInfo();
                this.initEvents();
            },

            initEvents: function initEvents() {
                $('[data-js="form-register"]').on('submit', this.handleSubmit);
            },

            handleSubmit: function handleSubmit(e) {
                e.preventDefault();
                var $tableCar = $('[data-js="table-car"]').get();
                $tableCar.appendChild(app.createNewCar());
            },

            createNewCar: function createNewCar() {
                var $fragment = document.createDocumentFragment(),
                    $tr = document.createElement('tr'),
                    $tdImage = document.createElement('td'),
                    $imagem = document.createElement('img'),
                    $tdCor = document.createElement('td'),
                    $tdAno = document.createElement('td'),
                    $tdBrandModel = document.createElement('td'),
                    $tdPlate = document.createElement('td'),
                    $tdRemove = document.createElement('td'),
                    $btnRemove = document.createElement('button'),
                    imagemUrl = $('[data-js="image"]').get().value;

                $tdBrandModel.textContent = $('[data-js="brand-model"]').get().value;
                $tdCor.textContent = $('[data-js="color"]').get().value;
                $tdAno.textContent = $('[data-js="year"]').get().value;
                $tdPlate.textContent = $('[data-js="plate"]').get().value;
                $btnRemove.textContent = 'Remover';
                $btnRemove.setAttribute('data-js', 'btn-remove');

                $imagem.setAttribute('src', imagemUrl)
                $tdImage.appendChild($imagem);
                $carRegisterNumber++;
                $tr.setAttribute('id', 'register-number-' + $carRegisterNumber);
                $tr.appendChild($tdImage);
                $tr.appendChild($tdBrandModel);
                $tr.appendChild($tdAno);
                $tr.appendChild($tdPlate);
                $tr.appendChild($tdCor);
                $btnRemove.setAttribute('data-js-register-relation', 'register-number-' + $carRegisterNumber);
                $tdRemove.appendChild($btnRemove);
                $tr.appendChild($tdRemove);

                $btnRemove.addEventListener('click', this.removeRegister, false);
                //console.log($('[data-js="btn-remove"]'));
                //$('[data-js="btn-remove"]').on('click', appControler().removeRegister);

                return $fragment.appendChild($tr);
            },

            removeRegister: function removeRegister(event) {
                event.preventDefault();
                this.parentNode.parentNode.remove();
            },

            companyInfo: function companyInfo() {
                var ajax = new XMLHttpRequest;
                ajax.open('GET', 'company.json', true);
                ajax.send();
                ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
            },

            getCompanyInfo: function getCompanyInfo() {
                if (!app.isReady.call(this))
                    return;

                var data = JSON.parse(this.responseText);
                var $companyName = $('[data-js="company-name"]');
                var $companyPhone = $('[data-js="company-phone"]');
                $companyName.get(0).textContent = data.name;
                $companyName.get(1).textContent = data.name;
                $companyPhone.get().textContent = data.phone;
            },

            isReady: function isReady() {
                return this.readyState === 4 && this.status === 200;
            }

        };
    })();

    app.init();

})(window.DOM);
