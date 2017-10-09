var restify = require('restify');
var builder = require('botbuilder');
var emoji = require('node-emoji');

var server = restify.createServer();

server.listen(
    process.env.port || 
    process.env.port || 
    3978, function()
    {
        console.log('%s listening to %s', server.name, server.url);
    });

var connector = new builder.ChatConnector(
    {
    appId: '',
    appPassword: ''
    });

var bot = new builder.UniversalBot(connector);
server.post('api/messages', connector.listen());

bot.dialog('/',[// 1º - dialog
    function(session,results,next)
    {
        if(!session.userData.name)//¿Cual es tu nombre?
        { 
            builder.Prompts.text(session, '¿Cual es su nombre?');
        }else{
            next();
        }
    },
    function (session,results)
    {
        if(results.response)
        {
            let msj = results.response;
            session.userData.nombre = msj;            
        }
        let emoji = emoji.get('hand');
        
        session.send(`hola ${session.userData.nombre} ${emoji}`);
        
        session.beginDialog('/place');
    }
]); //ok

bot.set('persistConversationData', true);

bot.dialog('/place', [ //2º dialog
    function(session,results,next)
    {
        if(!session.conversationData.place)//¿Dónde te encuentras?
        {
            builder.Prompts.text(session, '¿Dónde te encuentras?');
        }else{
            next();
        }
    },
    function (session,results)
    {
        if(results.response)
        {
            session.conversationData.place = results.response;
        }

        session.endConversation(`${session.conversationData.place} es un lugar bien chevere`);
        session.beginDialog('/food');
    }
]); //ok

bot.dialog('/food', [ //3º Dialog - ¿Que es lo que mas le gusta comer?
    function(session)
    {
        builder.Prompts.text(session, '¿Que es lo que mas le gusta comer?');
    },
    function (session, results)
    {
        let food = results.response;
        let icon = emoji.get('fork_and_knife'); 

        session.endConversation(`wow,  ${food} es lo que mas me gusta! ${icon}`);
        session.beginDialog('/weather');
    }
]); //ok

bot.dialog('/weather', [ //4º Dialog - ¿Que tal está el clima?
    function(session)
    { 
        builder.Prompts.text(session, `¿Que tal está el clima?` );
    },
    function (session, results)
    {
        let clima = results.response;
        session.dialogData.weather = clima;

        session.endConversation(`el ${session.dialogData.weather} es agradable`);
        session.beginDialog('/sport');
    }
]); //ok

bot.dialog('/sport', [ //5º Dialog - ¿Cuál es tu deporte favorito?
    function(session)
    {
        builder.Prompts.text(session, '¿Cuál es su deporte favorito?');
    },
    function (session, results)
    {
        let sport = results.response;
        session.endConversation(`Te gusta el ${sport}?, la verdad a mi no mucho`);
        session.beginDialog('/status');
    }
]); //ok

bot.dialog('/status', [ //6º Dialog - ¿Cuál es tu estado civil?
    function(session)
    {
        builder.Prompts.text(session, '¿Cuál es su estado civil?');
    },
    function (session, results)
    {
        let status = results.response;

        if(status == 'casado' || status == 'CASADO')
        {
            session.endConversation(`Me Alegra que estés ${status}`);
        }else{
            session.endConversation(`que bien por ti que estés ${status}`);
        }
        session.replaceDialog('/country');
    }
]); //ok

bot.dialog('/country', [ //7º Dialog - ¿De que pais eres?
    function(session)
    {
        builder.Prompts.text(session, '¿De que pais eres?');
    },
    function (session, results)
    {
        let country = results.response;

        if(country == 'colombia' || country == 'COLOMBIA' || country == 'Colombia')
        {
            session.endConversation(`${country} el tercer pais mas feliz del mundo`);
        }else{
            session.endConversation(`${country} me gusta`);
        }
        
        session.beginDialog('/tvshow');
    }
]); //ok

bot.dialog('/tvshow', [ //8º Dialog - ¿Cuál es su programa de televisión favorito?
    function(session)
    {
        builder.Prompts.text(session, '¿Cuál es su programa de televisión favorito?');
    },
    function (session, results)
    {
        let tvshow = results.response;

        session.endConversation(`te gusta ${tvshow}?, a mi me encanta!`);
        session.beginDialog('/movie');
    }
]); //ok

bot.dialog('/movie', [ //9º Dialog - método preguntar lugar
    function(session)
    {// objeto llamado sesiòn
        builder.Prompts.text(session, `¿Para usted, Cual es la mejor pelicula que existe?`);
    },
    function (session, results)
    {
        let movie = results.response;

        session.endConversation(`Esta pelicula ${movie}, es todo un chiste`);
        session.beginDialog('/studies');
    }
]); //ok

bot.dialog('/studies', [ //10º Dialog - método preguntar lugar
    function(session)
    {
        builder.Prompts.text(session, `Actualmente estas estuadiando?`);
    },
    function (session, results)
    {
        let ans1 = results.response;

        if(ans1 == 'si' || ans1 == 'SI' || ans1 == 'Si')
        {
            session.endConversation();
            session.beginDialog('/career');
        }else{
            session.endConversation(`Creo que lo mejor es estudiar`);
            session.beginDialog('/goodbye');
        }
    }
]); //ok

bot.dialog('/career', [ //11 Dialog - ¿qué estudias por ahora?
    function(session)
    {
        builder.Prompts.text(session, `¿qué estudias por ahora?`);
    },
    function (session, results)
    {
        let career = results.response;

            session.endConversation(`${career} esa carrera si me gusta, excelente decision!`);
        }
]); //ok