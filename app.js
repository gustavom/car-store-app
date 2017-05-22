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

    Tarefa:

    - Para listar os carros cadastrados ao carregar o seu projeto, faça um request GET no endereço
`http://localhost:3000/car`
- Para cadastrar um novo carro, faça um POST no endereço `http://localhost:3000/car`, enviando
os seguintes campos:
  - `image` com a URL da imagem do carro;
  - `brandModel`, com a marca e modelo do carro;
  - `year`, com o ano do carro;
  - `plate`, com a placa do carro;
  - `color`, com a cor do carro.

Após enviar o POST, faça um GET no `server` e atualize a tabela para mostrar o novo carro cadastrado.

    */
    var app = (function appControler() {

        var $carRegisterNumber = 0,
            $formImagem = $('[data-js="image"]').get(),
            $formBrandModel = $('[data-js="brand-model"]').get(),
            $formCor = $('[data-js="color"]').get(),
            $formAno = $('[data-js="year"]').get(),
            $formPlate = $('[data-js="plate"]').get(),
            $tableCar = $('[data-js="table-car"]').get();

        return {

            init: function () {
                this.companyInfo();
                this.initEvents();
                this.getCarsList();
            },

            initEvents: function initEvents() {
                $('[data-js="form-register"]').on('submit', this.handleSubmit);
            },

            handleSubmit: function handleSubmit(e) {
                e.preventDefault();
                //var $tableCar = $('[data-js="table-car"]').get();
                //$tableCar.appendChild(app.createNewCar());
                app.registesCarList();
                app.clearForm();
                app.clearTableBody();
                app.getCarsList();
            },

            clearForm: function clearForm() {
                $formImagem.value = '';
                $formBrandModel.value = '';
                $formAno.value = '';
                $formPlate.value = '';
                $formCor.value = '';
                $formImagem.focus();
            },
            
            clearTableBody: function clearTableBody(){
                $tableCar.innerHTML = '';
            },

            createNewCar: function createNewCar(array, index) {
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
                    imagemUrl = array[index].image;

                $tdBrandModel.textContent = array[index].brandModel;
                $tdCor.textContent = array[index].color;
                $tdAno.textContent = array[index].year;
                $tdPlate.textContent = array[index].plate;
                $btnRemove.textContent = 'Remover';
                $btnRemove.setAttribute('data-js', 'btn-remove');

                $imagem.setAttribute('src', imagemUrl)
                $tdImage.appendChild($imagem);
                $tr.appendChild($tdImage);
                $tr.appendChild($tdBrandModel);
                $tr.appendChild($tdAno);
                $tr.appendChild($tdPlate);
                $tr.appendChild($tdCor);
                $tdRemove.appendChild($btnRemove);
                $tr.appendChild($tdRemove);

                $btnRemove.addEventListener('click', this.removeRegister, false);

                return $fragment.appendChild($tr);
            },

            removeRegister: function removeRegister(e) {
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

            getCarsList: function getCarsList() {
                var k = 0;

                var ajax = new XMLHttpRequest;
                ajax.open('GET', 'http://localhost:3000/car', true);
                ajax.send();
                ajax.addEventListener('readystatechange', function () {
                    if (!app.isReady.call(this))
                        return;

                    var data = JSON.parse(this.responseText);
                    for (var k in data) {
                        $tableCar.appendChild(app.createNewCar(data, k));
                    };

                }, false);
            },

            registesCarList: function registesCarList() {
                var ajax = new XMLHttpRequest;
                ajax.open('POST', 'http://localhost:3000/car');
                ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                var car = {
                    image: $formImagem.value,
                    brandModel: $formBrandModel.value,
                    year: $formAno.value,
                    plate: $formPlate.value,
                    color: $formCor.value
                };

                var param = 'image=' + car.image + '&brandModel=' + car.brandModel + '&year=' + car.year + '&plate=' + car.year + '&color=' + car.color;
                ajax.send(param);
            },

            isReady: function isReady() {
                return this.readyState === 4 && this.status === 200;
            }

        };
    })();

    app.init();

})(window.DOM);
