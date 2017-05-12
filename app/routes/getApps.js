exports.sendAPP = function (cb) {

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });
    var sql = "SELECT DISTINCT Application FROM source_ticket ORDER BY Application ASC";
    connection.connect();

    connection.query(sql, function (err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
            connection.end();
        } else {
            connection.end();
            cb(rows);
        }
    });
};

/* Alex database-*/
exports.sendLibCourt = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    var result=new Array();
    var cpt = 0;
    var tab = new Array();

    if (body.liblong != undefined) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["LIB_LONG", body.table, "LIB_LONG"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    if (body.libcourt != undefined) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["LIB_COURT", body.table, "LIB_COURT"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    if (body.essai != undefined) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["LIB_LONG", "domaine", "LIB_LONG"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    
    cpt=0;
    connection.connect();
     for (var i = 0; i < tab.length; i++) {
        console.log(tab[i]);
        connection.query(tab[i], function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query number: '+i);
                connection.end();
                result="error";
                i=tab.length;
                cb(result);
            } else {
                console.log('success performing Query number: '+i);
                result[cpt]=rows;
                if(cpt==(tab.length-1))
                    {
                        connection.end();
                        console.log(result)
                        cb(result);
                    }
                cpt++;
            }

        });
    }
};