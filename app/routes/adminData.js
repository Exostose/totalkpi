/* Alex database-*/
exports.sendSelection = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    var result = new Array();
    var cpt = 0;
    var tab = new Array();

    if (body.liblong === 1) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["LIB_LONG", body.table, "LIB_LONG"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    if (body.libcourt === 1) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["LIB_COURT", body.table, "LIB_COURT"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    if (body.horaire === 1) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["PLAGE_HORAIRE", body.table, "PLAGE_HORAIRE"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    if (body.nom === 1) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["NOM", body.table, "NOM"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }
    if (body.fonction === 1) {
        tab[cpt] = "SELECT DISTINCT ?? FROM ?? ORDER BY ?? ASC";
        var insert = ["FONCTION", body.table, "FONCTION"];
        tab[cpt] = mysql.format(tab[cpt], insert);
        cpt++;
    }

    cpt = 0;

    connection.connect();
    for (var i = 0; i < tab.length; i++) {
        console.log(tab[i]);
        connection.query(tab[i], function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query number: ' + i);
                connection.end();
                i = tab.length;
                cb("error");
            } else {
                console.log('success performing Query number: ' + i);
                result[cpt] = rows;
                if (cpt == (tab.length - 1)) {
                    connection.end();
                    cb(result);
                }
                cpt++;
            }
        });
    }
};

exports.sendResult = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    var result = new Array();
    var cpt = 0;
    var tab = new Array();

    var sqltable = " FROM ?? ";
    var inserttable = [body.table];
    sqltable = mysql.format(sqltable, inserttable);

    /*GET DATA WITH FILTERS*/
    if (body.liblong !== "All" && body.liblong !== undefined) {
        tab[cpt] = new Array("LIB_LONG", body.liblong);
        cpt++;
    }
    if (body.libcourt !== "All" && body.libcourt !== undefined) {
        tab[cpt] = new Array("LIB_COURT", body.libcourt);
        cpt++;
    }
    if (body.nom !== "All" && body.nom !== undefined) {
        tab[cpt] = new Array("nom", body.nom);
        cpt++;
    }
    if (body.fonction !== "All" && body.fonction !== undefined) {
        tab[cpt] = new Array("fonction", body.fonction);
        cpt++;
    }

    /*GET THE RIGHT TABLE*/
    switch (body.table) {
        case "lot":
            var sqlSELECT = "SELECT contrat.LIB_COURT, lot.LIB_COURT,lot.LIB_LONG, lot.ID, contrat.ID";
            var sqlJOIN = "JOIN contrat ON lot.CONTRAT_ID=contrat.ID";
            var sql = sqlSELECT + sqltable + sqlJOIN;
            break;
        case "domaine":
            var sqlSELECT = "SELECT contrat.LIB_COURT, lot.LIB_COURT, domaine.LIB_COURT, domaine.LIB_LONG, domaine.ID";
            var sqlJOIN = "JOIN contrat ON domaine.LOT_CONTRAT_ID=contrat.ID JOIN lot ON domaine.LOT_ID=lot.ID";
            var sql = sqlSELECT + sqltable + sqlJOIN;
            break;
        case "application":
            var sqlSELECT = "SELECT contrat.LIB_COURT, lot.LIB_COURT, domaine.LIB_COURT,application.LIB_COURT,application.LIB_LONG, application.ID";
            var sqlJOIN = "JOIN contrat ON application.DOMAINE_LOT_CONTRAT_ID=contrat.ID JOIN lot ON application.DOMAINE_LOT_ID=lot.ID JOIN domaine ON application.DOMAINE_ID=domaine.ID";
            var sql = sqlSELECT + sqltable + sqlJOIN;
            break;
        case "ref_comite":
            var sqlSELECT = "SELECT ref_periode.LIB_COURT, ref_comite.LIB_COURT,ref_comite.LIB_LONG,ref_comite.ID, ref_periode.ID";
            var sqlJOIN = "JOIN ref_periode ON ref_comite.REF_PERIODE_ID=ref_periode.ID";
            var sql = sqlSELECT + sqltable + sqlJOIN;
            break;
        case "ref_indic":
            var sqlSELECT = "SELECT ref_service.LIB_COURT, ref_indic.LIB_COURT,ref_indic.LIB_LONG,ref_indic.ID, ref_service.ID";
            var sqlJOIN = "JOIN ref_service ON ref_indic.REF_SERVICE_ID=ref_service.ID";
            var sql = sqlSELECT + sqltable + sqlJOIN;
            break;
        case "ref_feu":
            var sql = "SELECT LIB_COURT, ID";
            sql = sql + sqltable;
            break;
        case "horaire":
            var sql = "SELECT PLAGE_HORAIRE, ID";
            sql = sql + sqltable;
            break;
        case "ref_contact":
            var sql = "SELECT *";
            sql = sql + sqltable;
            break;
        default:
            var sql = "SELECT LIB_COURT, LIB_LONG, ID";
            sql = sql + sqltable;
            break;
    }

    if (cpt === 1) {
        var sqlCOND = " WHERE ??.??=?"
        var insertCOND = [body.table, tab[0][0], tab[0][1]];
        sqlCOND = mysql.format(sqlCOND, insertCOND);
        sql = sql + sqlCOND;

    } else if (cpt === 2) {
        var sqlCOND = " WHERE ??.??=? AND ??.??=?"
        var insertCOND = [body.table, tab[0][0], tab[0][1], body.table, tab[1][0], tab[1][1]];
        sqlCOND = mysql.format(sqlCOND, insertCOND);
        sql = sql + sqlCOND;
    }
    connection.connect();
    var options = {
        sql: sql,
        nestTables: true
    };
    console.log(options.sql);
    console.log(tab);
    connection.query(options, function (err, results, fields) {
        if (err) {
            console.log('Error while performing Query');
            connection.end();
            cb("error");
        } else {
            console.log('success performing Query');
            connection.end();
            console.log(results);
            cb(results);
        }
    });

};

exports.insertData = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });
    var sqltable = "INSERT INTO ?? ";
    var insert = [body.table];
    sqltable = mysql.format(sqltable, insert);

    switch (body.table) {
        case "lot":
            var sqlC = "SELECT contrat.ID FROM contrat WHERE contrat.LIB_COURT=?";
            insert = [body.libCourtContrat];
            sqlC = mysql.format(sqlC, insert);
            break;
        case "domaine":
            var sqlC = "SELECT contrat.ID,lot.ID FROM contrat,lot WHERE contrat.LIB_COURT=? AND lot.LIB_COURT=?";
            insert = [body.libCourtContrat, body.libCourtLot];
            sqlC = mysql.format(sqlC, insert);
            break;
        case "application":
            var sqlC = "SELECT contrat.ID,lot.ID,domaine.ID FROM contrat,lot,domaine WHERE contrat.LIB_COURT=? AND lot.LIB_COURT=? AND domaine.LIB_COURT=?";
            insert = [body.libCourtContrat, body.libCourtLot, body.libCourtDomaine];
            sqlC = mysql.format(sqlC, insert);
            break;
        case "ref_comite":
            var sqlC = "SELECT ref_periode.ID FROM ref_periode WHERE ref_periode.LIB_COURT=?";
            insert = [body.libCourtPeriode];
            sqlC = mysql.format(sqlC, insert);
            break;
        case "ref_indic":
            var sqlC = "SELECT ref_service.ID FROM ref_service WHERE ref_service.LIB_COURT=?";
            insert = [body.libCourtService];
            sqlC = mysql.format(sqlC, insert);
            break;
    }

    var options = {
        sql: sqlC,
        nestTables: true
    };
    /*GET THE RIGHT TABLE*/
    switch (body.table) {
        case "ref_sla":
            var sqlVALUES = "VALUES (NULL,?,?,?)";
            insert = [body.libcourt, body.liblong, body.description]
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
        case "ref_contact":
            var sqlVALUES = "VALUES (NULL,?,?,?,?)";
            insert = [body.nom, body.prenom, body.fonction, body.mail]
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
        case "ref_feu":
            var sqlVALUES = "VALUES (NULL,?)";
            insert = [body.libcourt];
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
        case "horaire":
            var sqlVALUES = "VALUES (NULL,?)";
            insert = [body.horaire];
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
        case "contrat":
            var sqlVALUES = "VALUES (NULL,?,?,NULL,NULL,NULL,NULL)";
            insert = [body.libcourt, body.liblong]
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
        case "lot":
            var sqlVALUES = "VALUES (NULL,?,?,?,NULL,NULL,NULL,NULL)";
            connection.connect();
            connection.query(sqlC, function (err, results, fields) {
                if (err) {
                    console.log('Error while performing Query');
                    connection.end();
                } else {
                    connection.end();
                    console.log(results);
                    if (results != "") {
                        console.log(results[0].ID);
                        insert = [results[0].ID, body.libcourt, body.liblong]
                        sqlVALUES = mysql.format(sqlVALUES, insert);
                        var sql = sqltable + sqlVALUES;
                        exectQuery(sql, function (res) {
                            cb(res);
                        });
                    } else {
                        cb("failed");
                    }
                }
            });
            break;
        case "domaine":
            var sqlVALUES = "VALUES (NULL,?,?,?,?,NULL,NULL,NULL,NULL)";
            connection.connect();
            connection.query(options, function (err, results, fields) {
                if (err) {
                    console.log('Error while performing Query');
                    connection.end();
                } else {
                    connection.end();
                    if (results != "") {
                        insert = [results[0].contrat.ID, results[0].lot.ID, body.libcourt, body.liblong]
                        sqlVALUES = mysql.format(sqlVALUES, insert);
                        var sql = sqltable + sqlVALUES;
                        exectQuery(sql, function (res) {
                            cb(res);
                        });
                    } else {
                        cb("failed");
                    }
                }
            });
            break;
        case "application":
            var sqlVALUES = "VALUES (NULL,?,?,?,?,?,NULL,NULL,NULL,NULL)";
            connection.connect();
            connection.query(options, function (err, results, fields) {
                if (err) {
                    console.log('Error while performing Query');
                    connection.end();
                } else {
                    connection.end();
                    if (results != "") {
                        insert = [results[0].contrat.ID, results[0].lot.ID, results[0].domaine.ID, body.libcourt, body.liblong]
                        sqlVALUES = mysql.format(sqlVALUES, insert);
                        var sql = sqltable + sqlVALUES;
                        exectQuery(sql, function (res) {
                            cb(res);
                        });
                    } else {
                        cb("failed");
                    }
                }
            });
            break;
        case "ref_comite":
            var sqlVALUES = "VALUES (NULL,?,?,?,?,NULL,NULL)";
            connection.connect();
            connection.query(sqlC, function (err, results, fields) {
                if (err) {
                    console.log('Error while performing Query');
                    connection.end();
                } else {
                    connection.end();
                    console.log(results);
                    if (results != "") {
                        insert = [results[0].ID, body.libcourt, body.liblong, body.description]
                        sqlVALUES = mysql.format(sqlVALUES, insert);
                        var sql = sqltable + sqlVALUES;
                        exectQuery(sql, function (res) {
                            cb(res);
                        });
                    } else {
                        cb("failed");
                    }
                }
            });
            break;
        case "ref_service":
            var sqlVALUES = "VALUES (NULL,?,?,?,NULL,NULL,NULL,NULL,NULL)";
            insert = [body.libcourt, body.liblong, body.Description];
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
        case "ref_indic":
            var sqlVALUES = "VALUES (NULL,?,?,?,?,5,NULL,NULL,NULL,NULL)";
            connection.connect();
            connection.query(sqlC, function (err, results, fields) {
                if (err) {
                    console.log('Error while performing Query');
                    connection.end();
                } else {
                    connection.end();
                    console.log(results);
                    if (results != "") {
                        insert = [results[0].ID, body.libcourt, body.liblong, body.Description]
                        sqlVALUES = mysql.format(sqlVALUES, insert);
                        var sql = sqltable + sqlVALUES;
                        exectQuery(sql, function (res) {
                            cb(res);
                        });
                    } else {
                        cb("failed");
                    }
                }
            });
            break;
        default:
            var sqlVALUES = "VALUES (NULL,?,?)";
            insert = [body.libcourt, body.liblong, body.description]
            sqlVALUES = mysql.format(sqlVALUES, insert);
            var sql = sqltable + sqlVALUES;
            exectQuery(sql, function (res) {
                cb(res);
            });
            break;
    }


};

function exectQuery(sql, callback) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });
    console.log("requete: " + sql);
    console.log("executing query");
    connection.connect();
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.log('Error while performing Query');
            connection.end();
        } else {
            console.log('success performing Query');
            connection.end();
            callback("success");
        }
    });
}

exports.removeData = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    var sql = "DELETE FROM ?? WHERE ID=?";
    var insert = [body.table, body.ID];
    sql = mysql.format(sql, insert);

    connection.connect();
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.log('Error while performing Query');
            connection.end();
            cb(0);
        } else {
            console.log('success performing Remove Query');
            connection.end();
            cb("success");
        }
    });

};

exports.updateData = function (body, cb) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'combesb',
        password: 'bertrand1994',
        database: 'totalkpi'
    });

    switch (body.table) {
        case "ref_feu":
            var sql = "UPDATE ?? SET LIB_COURT=? WHERE ID=?";
            var insert = [body.table, body.libcourt, body.ID];
            sql = mysql.format(sql, insert);
            break;
        case "horaire":
            var sql = "UPDATE ?? SET PLAGE_HORAIRE=? WHERE ID=?";
            var insert = [body.table, body.horaire, body.ID];
            sql = mysql.format(sql, insert);
            break;
        case "ref_contact":
            var sql = "UPDATE ?? SET NOM=?, PRENOM=?,FONCTION=?,MAIL=? WHERE ID=?";
            var insert = [body.table, body.nom, body.prenom, body.fonction, body.mail, body.ID];
            sql = mysql.format(sql, insert);
            break;
        default:
            var sql = "UPDATE ?? SET LIB_COURT=?, LIB_LONG=? WHERE ID=?";
            var insert = [body.table, body.libcourt, body.liblong, body.ID];
            sql = mysql.format(sql, insert);
            break;
    }
    connection.connect();
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.log('Error while performing Query');
            connection.end();
        } else {
            console.log('success performing Remove Query');
            connection.end();
            cb("success");
        }
    });

};
