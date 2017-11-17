var bodyParser = require("body-parser");
var scraperjs = require('scraperjs');
var request = require('request');
var cheerio = require('cheerio');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //var soup = new JSSoup(html_doc);
    //console.log(soup.prettify());
    app.get("/api/movies", function (req, res) {
        getMovies(function (response) {
            console.log("Teste 1");
            console.log(response);
            res.send("response");
        });
    });
}

function getMovies() {
    /*scraperjs.StaticScraper.create("http://www.adorocinema.com/filmes/numero-cinemas/")
        .scrape(function ($) {
            return $(".hred").map(function () {
                var metaLink = $(".meta-title-link", this);
                var metaBody = $(".meta-body-item meta-body-info", this);
                var lancamento = $(".xXx date blue-link", this);
                var genero = $(".xXx", this);
                var imagem = $(".thumbnail-img b-loaded", this);
                var sinopse = $(".synopsis", this);
                var movie = {
                    titulo: metaLink.text(),
                    lancamento: lancamento.text(),
                    metaBody: metaBody.text(),
                    genero: genero.text(),
                    imagem: imagem.text(),
                    sinopse: sinopse.text()
                }
                return movie;
            }).get();
        })
        .then(function (movies) {
            //console.log(movies);
            console.log(movies);
            return movies;
        })*/
    url = "http://www.adorocinema.com/filmes/numero-cinemas/";
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var titulo, diretor, lancamento, sinopse, imagem;
            var elenco = [];
            var genero = [];
            var jsons = [];
            var json = { titulo: "", lancamento: "", genero: "" };

            $('li.hred').each(function (i, elem) {
                var divCard = $(this).children().first();

                titulo = divCard.children("div.meta").children().first().children().first().text();
                diretor = divCard.children("div.meta").children("div.meta-body").children().eq(1).children().first().text();
                lancamento = divCard.children("div.meta").children("div.meta-body").children("div.meta-body-item").children().first().text()
                imagem = divCard.children().first().children().first().children().first().attr("src");
                sinopse = divCard.children("div.meta-more").children().first().text();


                divCard.children("div.meta").children("div.meta-body").children().first().children("a.xXx").each(function (j, elem1) {
                    genero.push($(this).text());
                })

                divCard.children("div.meta").children("div.meta-body").children().eq(2).children().each(function (j, elem1) {
                    elenco.push($(this).text());
                })
                jsons.push(
                    {
                        titulo: titulo,
                        diretor: diretor,
                        lancamento: lancamento,
                        genero: genero,
                        imagem: imagem,
                        sinopse: sinopse,
                        elenco: elenco
                    }
                );
                genero = [];
                elenco = [];
            });
            console.log(jsons);
        }
    });

}