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
            builder.Prompts.text(session, 'Hola, ¿Cual es su nombre?');
        }else{
            next();
        }
    },
    function (session,results)
    {
        if(results.response)
        {
            let msj = results.response;
            session.userData.name = msj;            
        }
        let emoji1 = emoji.get('hand');
        
        session.send(`hola ${session.userData.name} ${emoji1}`);
        
        session.beginDialog('/place');
    }
]); //ok

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

        let emoji2 = emoji.get('sunny'); 
        let emoji3 = emoji.get('sun_with_face'); 

        if(session.conversationData.place == 'cartago' || session.conversationData.place == 'CARTAGO' || session.conversationData.place == 'Cartago')
            {
                session.endConversation(`${session.conversationData.place} ${emoji3} el sol mas alegre de colombia`);
            }else{
                session.endConversation(`${session.conversationData.place} es un lugar bien chevere ${emoji2}`);
            }  

        session.beginDialog('/weather');
    }
]); //ok

bot.dialog('/weather', [ //3º Dialog - ¿Que tal está el clima?
    function(session)
    { 
        let emoji4 = emoji.get('cloud'); 
        builder.Prompts.text(session, `¿Que tal está el clima? ${emoji4}` );
    },
    function (session, results)
    {
        let clima = results.response;
        session.dialogData.weather = clima;

        session.endConversation(`el ${session.dialogData.weather} es agradable`);
        session.beginDialog('/country');
    }
]); //ok

bot.dialog('/country', [ //4º Dialog - ¿De que pais eres?
    function(session)
    {
        builder.Prompts.text(session, '¿De que pais eres?');
    },
    function (session, results)
    {
        let country = results.response;

        if(country == 'colombia' || country == 'COLOMBIA' || country == 'Colombia')
        {
            let emoji5 = emoji.get('heart_eyes');
            session.endConversation(`${country} ${emoji5}el tercer pais mas feliz del mundo`);
        }else{
            session.endConversation(`${country} me gusta`);
        }
        
        session.beginDialog('/food');
    }
]); //ok

bot.dialog('/food', [ //5º Dialog - ¿Que es lo que mas le gusta comer?
    function(session)
    {
        builder.Prompts.text(session, '¿Que es lo que mas le gusta comer?');
    },
    function (session, results)
    {
        let food = results.response;
        let emoji6 = emoji.get('fork_and_knife'); 

        session.endConversation(`wow,  ${food} es lo que mas me gusta! ${emoji6}`);
        session.beginDialog('/tvshow');
    }
]); //ok

bot.dialog('/tvshow', [ //6º Dialog - ¿Cuál es su programa de televisión favorito?
    function(session)
    {
        builder.Prompts.text(session, '¿Cuál es su programa de televisión favorito?');
    },
    function (session, results)
    {
        let tvshow = results.response;

        session.endConversation(`te gusta ${tvshow}?, a mi me encanta!`);
        session.beginDialog('/sport');
    }
]); //ok

bot.dialog('/sport', [ //7º Dialog - ¿Cuál es tu deporte favorito?
    function(session)
    {
        builder.Prompts.text(session, '¿Cuál es su deporte favorito?');
    },
    function (session, results)
    {
        let sport = results.response;
        let emoji8 = emoji.get('bike');
        
        session.endConversation(`Te gusta el ${sport}?, la verdad a mi me gusta el ciclismo  ${emoji8}`);
        session.beginDialog('/status');
    }
]); //ok

bot.dialog('/status', [ //8º Dialog - ¿Cuál es tu estado civil?
    function(session)
    {
        builder.Prompts.text(session, '¿Cuál es su estado civil?');
    },
    function (session, results)
    {
        let status = results.response;
        let emoji9 = emoji.get('unamused');
        session.endConversation(`que bien por ti que estés ${status} ${emoji9}`);
        session.replaceDialog('/movie');
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
        builder.Prompts.text(session, `Actualmente estas estudiando?`);
    },
    function (session, results)
    {
        let ans1 = results.response;

        if(ans1 == 'si' || ans1 == 'SI' || ans1 == 'Si')
        {
            session.endConversation(`Lo mejor que puedes hacer es estudiar, es lo unico que no tiene precio`);
        }else{
            session.endConversation(`Creo que lo mejor es estudiar`);
        }
    }
]); //ok