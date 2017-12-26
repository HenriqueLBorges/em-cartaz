var config = require("../config");
var bodyParser = require("body-parser");
var request = require('request');
var cheerio = require('cheerio');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/api/filmes", function (req, res) {
        getMovies(res);
    });
}

function getMovies(res) {

    url = "http://www.adorocinema.com/filmes/numero-cinemas/";
    var promise = new Promise(function (resolve, reject) {
        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var titulo, diretor, lancamento, nota, sinopse, imagem, trailer, programacao;
                var elenco = [];
                var genero = [];
                var filmes = [];
                var index;

                $('li.hred').each(function (i, elem) {
                    //Class = "card card-entity card-entity-list cf"
                    var divCard = $(this).children().first();

                    titulo = divCard.children("div.meta").children().first().children().first().text();
                    diretor = divCard.children("div.meta").children("div.meta-body").children().eq(1).children().first().text();
                    lancamento = divCard.children("div.meta").children("div.meta-body").children("div.meta-body-item").children().first().text();
                    imagem = divCard.children().first().children().first().children().first().attr("data-src");
                    trailer = divCard.children("div.meta-more").children().eq(2).attr("href");
                    programacao = divCard.children("div.meta-more").children().eq(3).attr("href");
                    if (typeof trailer !== "undefined") {
                        index = trailer.indexOf("file://");
                        trailer = trailer.substring(index);
                    }
                    if (typeof programacao !== "undefined") {
                        index = programacao.indexOf("file://");
                        programacao = programacao.substring(index);
                    }
                    trailer = "http://www.adorocinema.com" + trailer
                    programacao = "http://www.adorocinema.com" + programacao

                    nota = divCard.children("div.meta-more").children().eq(1).children().first().children().eq(1).text();
                    //Removes \n from the string
                    nota = nota.substring(17, nota.length);

                    sinopse = divCard.children("div.meta-more").children().first().text();
                    //Removes all spaces and \n from the string
                    sinopse = sinopse.substring(21, sinopse.length);
                    sinopse = sinopse.substring(0, sinopse.indexOf("\n"));

                    divCard.children("div.meta").children("div.meta-body").children().first().children().each(function (j, elem1) {
                        if (j > 2)
                            genero.push($(this).text());
                    });

                    divCard.children("div.meta").children("div.meta-body").children().eq(2).children().each(function (j, elem1) {
                        elenco.push($(this).text());
                    });

                    if (titulo !== "") {
                        filmes.push(
                            {
                                titulo: titulo,
                                diretor: diretor,
                                lancamento: lancamento,
                                genero: genero,
                                imagem: imagem,
                                trailer: trailer,
                                programacao: programacao,
                                nota: nota,
                                sinopse: sinopse,
                                elenco: elenco
                            }
                        );
                    }
                    genero = [];
                    elenco = [];
                });
                resolve(filmes);
            }
            else promise.catch();

            promise.then(function (filmes) {
                res.send(filmes);
            })
        });
    });
}