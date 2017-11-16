var bodyParser = require("body-parser");
var scraperjs = require('scraperjs');

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
    scraperjs.StaticScraper.create("http://www.adorocinema.com/filmes/numero-cinemas/")
        .scrape(function ($) {
            return $(".hred").map(function () {
                var metaLink = $(".meta-title-link", this);
                var metaBody = $(".meta-body-item meta-body-info", this);
                var lancamento = $(".xXx date blue-link", this);
                var genero = $(".xXx", this);
                var movie = {
                    titulo: metaLink.text(),
                    lancamento: lancamento.text(),
                    metaBody: metaBody.text(),
                    genero: genero.text()
                }
                return movie;
            }).get();
        })
        .then(function (movies) {
            //console.log(movies);
            console.log("Teste");
            return movies;
        })
}