#cnCt — DOM from cnCt JSON

Создаёт DOM дерево из cnCt JSON описания с помощью методов DOM

###cnCt документация

На данный момент основная документация находиться в [cnCt.js](https://github.com/SoftWearFinance/cnCt/blob/master/cnCt.js)

###cnCt JSON параметры

e {String} — имя узла, если не указано создаёт div

N {String} — имя немспейса узла

с {String} — строка классов

n {String|Array} — имя свойства объекта-результата выполнения методов .tp или .createElements, в котором будет ссылка на этот узел

С {Array|Object|String} — контент узла
    if (C is Array) проинитит проинити каждый элемент массива как узел или текстовый узел
    else if (C is Object) проинитит как узел
    else проинитит как тектовый узел

t {String} — создаст текстовый узел в элементе

i {String} — id узла

h {String} — href узла

T {String} — type узла

v {String} — value  узла

S {String} — src узла

a {Object} — attributes узла

H {String} — html узла

###cnCt пример использования

```javascript

window.onload = function(){
    var template = [
        {c: 'header', C: [
            {e: 'a', c: 'logo', n: 'logo', h: '/'},
            {c: 'header-title', t: 'hello'},
            {c: 'login', n: ['login', 'button']}
        ]},
        {c: 'content', C: [
            'say hello',
            {e: 'a', h: 'http://softwearfinance.com', t: 'SoftWear'},
            {c: 'button', t: 'say hello', n: 'button'}
        ]},
        {c: 'footer', t: '© SoftWear LLC'}
    ],
    templateFunction = function(data){
        return [
           {c: 'header', C: [
               {e: 'a', c: 'logo', n: 'logo', h: '/'},
               {c: 'header-title', t: 'hello'},
               {c: 'login', n: ['login', 'button']}
           ]},
           {c: 'content', C: [
               'say hello',
               {e: 'a', h: data.companyLink, t: data.companyName},
               {c: 'button', t: data.buttonText, n: 'button'}
           ]},
           {c: 'footer', t: data.rights}
        ];
    },
    templatesList = {
        main: templateFunction,
        micro: function (data){
            return {c: 'micro', C:
                {c: 'micro-text', t: 'micro'}
            };
        }
    },
    data = {
        companyLink: 'http://softwearfinance.com',
        companyName: 'SoftWear',
        buttonText: 'say hello',
        rights: '© SoftWear LLC'
    },
    result1,
    result2,
    result3,
    result4;

result1 = cnCt.createElements(template);
/*
{
    r: DF,
    logo: a.logo,
    button:[
        div.login,
        div.button
    ],
    login: div.login
}
*/

result2 = cnCt.tp(templateFunction, data);
/*
{
    r: DF,
    logo: a.logo,
    button:[
        div.login,
        div.button
    ],
    login: div.login
}
*/

cnCt.bindTemplates(templatesList);
result3 = cnCt.tp('main', data, document.body);
/*
{
    r: DF,
    logo: a.logo,
    button:[
        div.login,
        div.button
    ],
    login: div.login
}
*/

result4 = cnCt.tp('micro', document.body);
/*
{
    r: div.micro,
}
*/

}

```

###Спасибо

[@pavelmalyshev](https://twitter.com/pavelmalyshev)

[@kurilidze](https://twitter.com/kurilidze)

[@OrrB](https://twitter.com/OrrB)

[@mistadikay](https://twitter.com/mistadikay)

###cnCt лицензия

[MIT](https://github.com/SoftWearFinance/cnCt/blob/master/license.txt)

© 2013 [SoftWearFinance LLC](http://softwearfinance.com/), [Dmitry Makhnev](https://github.com/DmitryMakhnev/)
