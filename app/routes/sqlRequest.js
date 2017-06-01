exports.switchFav = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    var id = body.id;
    var fav = body.Fav;
    var sql = "UPDATE source_ticket SET FAVORIS=? WHERE ID=?";
    var insert = [fav, id];
    sql = mysql.format(sql, insert);
    console.log(sql);
    connection.connect();
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
        }
        connection.end();
        cb(rows);
    });
};

exports.getFavo = function (cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });
    var sql = "SELECT * FROM source_ticket WHERE FAVORIS=true";
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

exports.sendSQL = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    var I = false;
    var id = body.id;
    var RadioB = body.Prio;
    var Stat = body.Stat;
    var App = body.App;

    var cpt = 0;
    var tab = new Array();
    if (id == null) {
        id = "";
    }

    if (id.indexOf('%') > -1) {
        I = true;
        var sql2 = "ID LIKE ?";
        var insert2 = [id];
        sql2 = mysql.format(sql2, insert2);
    } else if (!((id == null) || (id == ""))) {
        tab[cpt] = new Array("ID", id);
        cpt++;
    }

    if (!(RadioB === "All")) {
        tab[cpt] = new Array("PRIORITY", RadioB);
        cpt++;
    }
    if (!(Stat === "All")) {
        tab[cpt] = new Array("REQUEST_STATUS", Stat);
        cpt++;
    }
    if (!(App === "All")) {
        tab[cpt] = new Array("Application", App);
        cpt++;
    }

    switch (cpt) {
        case 0:
            var sql = "SELECT * FROM source_ticket";
            break;

        case 1:
            var sql = "SELECT * FROM source_ticket where ??=?";
            var insert = [tab[0][0], tab[0][1]];
            sql = mysql.format(sql, insert);
            break;

        case 2:
            var sql = "SELECT * FROM source_ticket where ??=? AND ??=?";
            var insert = [tab[0][0], tab[0][1], tab[1][0], tab[1][1]];
            sql = mysql.format(sql, insert);
            break;

        case 3:
            var sql = "SELECT * FROM source_ticket where ??=? AND ??=? AND ??=?";
            var insert = [tab[0][0], tab[0][1], tab[1][0], tab[1][1], tab[2][0], tab[2][1]];
            sql = mysql.format(sql, insert);
            break;
        case 4:
            var sql = "SELECT * FROM source_ticket where ??=? AND ??=? AND ??=? AND ??=?";
            var insert = [tab[0][0], tab[0][1], tab[1][0], tab[1][1], tab[2][0], tab[2][1], tab[3][0], tab[3][1]];
            sql = mysql.format(sql, insert);
            break;
    }

    if ((I) && (cpt == 0)) {
        sql = sql + " WHERE " + sql2;
        console.log("REQUETE: " + sql);
    } else if ((I) && (cpt != 0)) {
        sql = sql + " AND " + sql2;
        console.log("REQUETE: " + sql);
    }

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

exports.connect = function (body, cb) {

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });
    var sql = "SELECT LOGIN,PASSWORD FROM login";
    connection.connect();

    connection.query(sql, function (err, rows, fields) {
        if (err) {
            console.log('Error while performing Query.');
            connection.end();
        } else {
            connection.end();

            for (var i = 0; i < rows.length; i++) {
                if ((rows[i].LOGIN == body.login) && (rows[i].PASSWORD == body.password)) {
                    cb("ok");
                    break;
                }
            }
            cb("no");

        }
    });
};
