//Variables
var flask;
var sintacticTable;
var tablaLexica;
var $tablaLexica_btn;
var $tableContainer;
var $runBtn;
var $eraseBtn;
var error_codes;
var DML;
var DDL_CREATE;
var DDL_INSERT;
var paneles;
var semantica = {
  tabla:[],
  atributos:[],
  restricciones:[]
};
var semantica_copy = {};
var insertStack = {
  'table': '',
  'atribs': [],
  'values':[],
  'indx': 0,
  'ins': []
}
//String prototype, para generar foreach
String.prototype.forEach = function (call) {
  var a = this.split('');
  a.forEach(e => { call(e) })
}
// On ready
$(function(){
  //Tabla sintactia
  sintacticTable = {
    //LEXEMAS
    'select': {
      'simbolo': 's',
      'valor': 10
    },
    'from':{
      'simbolo': 'f',
      'valor': 11
    },
    'where':{
      'simbolo': 'w',
      'valor': 12
    },
    'in':{
      'simbolo': 'n',
      'valor': 13
    },
    'and':{
      'simbolo': 'y',
      'valor': 14
    },
    'or':{
      'simbolo': 'o',
      'valor': 15
    },
    'create':{
      'simbolo': 'c',
      'valor': 16
    },
    'table':{
      'simbolo': 't',
      'valor': 17
    },
    'char':{
      'simbolo': 'h',
      'valor': 18
    },
    'numeric':{
      'simbolo': 'u',
      'valor': 19
    },
    'not':{
      'simbolo': 'e',
      'valor': 20
    },
    'null':{
      'simbolo': 'g',
      'valor': 21
    },
    'constraint':{
      'simbolo': 'b',
      'valor': 22
    },
    'key':{
      'simbolo': 'k',
      'valor': 23
    },
    'primary':{
      'simbolo': 'p',
      'valor': 24
    },
    'foreign':{
      'simbolo': 'j',
      'valor': 25
    },
    'references':{
      'simbolo': 'l',
      'valor': 26
    },
    'insert':{
      'simbolo': 'm',
      'valor': 27
    },
    'into':{
      'simbolo': 'q',
      'valor': 28
    },
    'values':{
      'simbolo': 'v',
      'valor': 29
    },
    //Delimitadores
    ',':{
      'simbolo' : ',',
      'valor' : 50
    },
    '.':{
      'simbolo' : '.',
      'valor' :  51
    },
    '(':{
      'simbolo' : '(',
      'valor' :  52
    },
    ')':{
      'simbolo' : ')',
      'valor' :  53
    },
    '\"':{
      'simbolo' : '\"',
      'valor' :  54
    },
    ';':{
      'simbolo' : ';',
      'valor' : 55
    },
    // Constantes
    // 'd':{
    //   'simbolo': 'd',
    //   'valor' : 61
    // },
    // 'a':{
    //   'simbolo': 'a',
    //   'valor' : 62
    // },
    // 'c':{ // Identificador
    //   'simbolo': 'c',
    //   'valor' : 63
    // },
    // Operadores
    '+':{
      'simbolo': '+',
      'valor':70
    },
    '-':{
      'simbolo':'-',
      'valor':71
    },
    '*':{
      'simbolo':'*',
      'valor':72
    },
    '/':{
      'simbolo':'/',
      'valor':73
    },
    //Relacionales
    '>':{
      'simbolo':'>',
      'valor':81
    },
    '<':{
      'simbolo':'<',
      'valor':82
    },
    '=':{
      'simbolo':'=',
      'valor':83
    },
    '>=':{
      'simbolo':'>=',
      'valor':84
    },
    '<=':{
      'simbolo':'<=',
      'valor':85
    }
  };
  DML = {
    'select': {
      'links':['*', 'atrib1'],
      'match': function(x){
        return x.match( /^(SELECT)$/i);
      },
      'state': false,
      'err': function(){
        console.log('select');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    '*': {
      'links': ['from'],
      'match': function(x){
        return x.match( /^(\*)$/i);
      },
      'state': false,
      'err': function(){
        console.log('*');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'atrib1': {
      'links': [',1', 'from'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#])*(\.[A-Z])*([\w|\#])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('atrib1');
        return [201, 205];
      },
      'semantico': function(x){
        return true;
      }
    },
    ',1': {
      'links': ['atrib1'],
      'match': function(x){
        return x == ',';
      },
      'state': false,
      'err': function(){
        console.log(',1');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'from': {
      'links': ['tabla'],
      'match': function(x){
        return x.match( /^(FROM)$/i);
      },
      'state': false,
      'err': function(){
        console.log('from');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'tabla': {
      'links': [',2', 'where', ')', ';', 'tabla-as'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('tabla');
        return [205, 201];
      },
      'semantico': function(x){
        return true;
      }
    },
    ',2': {
      'links': ['tabla'],
      'match': function(x){
        return x == ',';
      },
      'state': false,
      'err': function(){
        console.log(',2');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'tabla-as': {
      'links': [',2', 'where', ')', ';'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('tabla-as');
        return [205, 201];
      },
      'semantico': function(x){
        return true;
      }
    },
    'where': {
      'links': ['num1', 'txt1', 'identi1'],
      'match': function (x) {
        return x.match(/^(WHERE)$/i);
      },
      'state': false,
      'err': function(){
        console.log('where');
        return [204, 206];
      },
      'semantico': function(x){
        return true;
      }
    },
    'not': {
      'links': ['(1'],
      'match': function (x) {
        return x.match(/^(NOT)$/i);
      },
      'state': false,
      'err': function(){
        console.log('not');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    '(1':{
      'links': ['num1', 'txt1', 'identi1'],
      'match': function (x) {
        return x == '(';
      },
      'state': false,
      'err': function(){
        console.log('where');
        return [204, 206];
      },
      'semantico': function(x){
        return true;
      }
    },
    'num1': {
      'links': ['in', 'relacional', 'operator1'],
      'match': function (x) {
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match(/^[+-]?\d+(\.\d+)?$/);
        }
      },
      'state': false,
      'err': function(){
        console.log('num1');
        return [208, 201];
      },
      'semantico': function(x){
        return true;
      }
    },
    'txt1': {
      'links': ['in', 'relacional', 'operator1'],
      'match': function (x) {
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match(/^'([^'])*'$/i);
        }
      },
      'state': false,
      'err': function (){
        console.log('txt1');
        return [208, 201]
      },
      'semantico': function(x){
        return true;
      }
    },
    'identi1': {
      'links': ['in', 'relacional', 'operator1'],
      'match': function (x) {
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match(/^([A-Z])+([\w|\d|\#])*(\.[A-Z]+[\w|\d|\#]+)?$/i);
        }
      },
      'state': false,
      'err': function(){
        console.log('identi1');
        return [208, 201];
      },
      'semantico': function(x){
        return true;
      }
    },
    'operator1': {
      'links': ['num1', 'txt1', 'identi1'],
      'match': function (x) {
        return x.match(/^(\*|\/|\+|\-)$/);
      },
      'state': false,
      'err': function(){
        console.log('operator1');
        return [204, 206];
      },
      'semantico': function(x){
        return true;
      }
    },
    'relacional': {
      'links': ['txt2', 'identi2', 'num2'],
      'match': function (x) {
        return x.match(/^(<>|<=|>=|=|<|>)$/);
      },
      'state':false,
      'err': function(){
        console.log('relacional');
        return [204, 206];
      },
      'semantico': function(x){
        return true;
      }
    },
    'num2': {
      'links': ['andOr', ')', ';', 'operator2'],
      'match': function (x) {
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match(/^[+-]?\d+(\.\d+)?$/);
        }
      },
      'state': false,
      'err': function(){
        console.log('num2');
        return [201, 205];
      },
      'semantico': function(x){
        return true;
      }
    },
    'txt2': {
      'links': ['andOr', ')', ';', 'operator2'],
      'match': function (x) {
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match(/^'([^'])*'$/i);
        }
      },
      'state': false,
      'err': function(){
        console.log('txt2');
        return [201, 205];
      },
      'semantico': function(x){
        return true;
      }
    },
    'identi2': {
      'links': ['andOr', ')', ';', 'operator2'],
      'match': function (x) {
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match(/^([A-Z])+([\w|\d|\#])*(\.[A-Z]+[\w|\d|\#]+)?$/i);
        }
      },
      'state': false,
      'err': function(){
        console.log('identi2');
        return [201, 205];
      },
      'semantico': function(x){
        return true;
      }
    },
    'operator2': {
      'links': ['num2', 'txt2', 'identi2'],
      'match': function (x) {
        return x.match(/^(\*|\/|\+|\-)$/);
      },
      'state': false,
      'err': function(){
        console.log('operator2');
        return [204, 206];
      },
      'semantico': function(x){
        return true;
      }
    },
    ')': {
      'links':[')', 'andOr', ';'],
      'match': function(x){
        return x==')'
      },
      'state': false,
      'err': function(){
        console.log(')');
        return [205, 201];
      },
      'semantico': function(x){
        return true;
      }
    },
    'andOr': {
      'links':['identi1', 'num1', 'txt1', 'not'],
      'match': function(x){
        return x.match( /^(AND|OR)$/i);
      },
      'state':false,
      'err': function(){
        console.log('andOr');
        return [204, 206];
      },
      'semantico': function(x){
        return true;
      }
    },
    'in': {
      'links': ['('],
      'match': function(x){
        return x.match( /^(IN)$/i);
      },
      'state': false,
      'err': function(){
        console.log('in');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    '(': {
      'links':['select'],
      'match': function (x) {
        return x=='(';
      },
      'state': false,
      'err': function(){
        console.log('(');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    ';': {
      'state': true,
      'match': function(x){
        return x == ';';
      },
      'semantico': function(){
        return true;
      }
    }
  }
  DDL_CREATE = {
    'create': {
      'links':['table'],
      'match': function(x){
        return x.match( /^(CREATE)$/i);
      },
      'state': false,
      'err': function(){
        console.log('create');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'table': {
      'links':['tableName'],
      'match': function(x){
        return x.match( /^(TABLE)$/i);
      },
      'state': false,
      'err': function(){
        console.log('table');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'tableName': {
      'links':[';', '(1'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('tableName');
        return 205;
      },
      'semantico': function(x, linea){
        for(let i in semantica.tabla){
          if(semantica.tabla[i].nombre === x){
            console.log('tableName', x, linea);
            updateInfoMessage(302, linea);
            return false;
          }
        }
        semantica.tabla.push({'nombre':x, 'atributos': 0, 'restricciones': 0});
        return true;
      }
    },
    '(1': {
      'links':['primary', 'foreign', 'constraint', 'atrib'],
      'match': function(x){
        return x = '(';
      },
      'state': false,
      'err': function(){
        console.log('(1');
        return [201, 204];
      },
      'semantico': function(x){
        return true;
      }
    },
    //Atributos
    'atrib': {
      'links':['tipo'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('atrib');
        return 201;
      },
      'semantico': function(x, linea){
        let tId = semantica.tabla.length-1;
        for(let i in semantica.atributos){
          if(semantica.tabla[tId].nombre == semantica.atributos[i].tabla && semantica.atributos[i].nombre == x){
            updateInfoMessage(302, linea);
            return false;
          }
        }
        semantica.atributos.push({'tabla': semantica.tabla[tId].nombre, 'nombre': x, 'tipo': false, 'longitud':false, 'null': true});
        semantica.tabla[tId].atributos++;
        return true;
      }
    },
    'tipo': {
      'links':['(tipo', 'cualidad', 'not', ')', ','],
      'match': function(x){
        return x.match( /^(CHAR|NUMERIC)$/i);
      },
      'state': false,
      'err': function(){
        console.log('tipo');
        return [201, 205];
      },
      'semantico': function(x){
        semantica.atributos[semantica.atributos.length-1].tipo=x;
        return true;
      }
    },
    '(tipo': {
      'links':['num'],
      'match': function(x){
        return x == '(';
      },
      'state': false,
      'err': function(){
        console.log('(tipo');
        return 206;
      },
      'semantico': function(x){
        return true;
      }
    },
    'num': {
      'links': [')tipo'],
      'match': function (x) {
        return x.match(/^[+-]?\d+(\.\d+)?$/);
      },
      'state': false,
      'err': function(){
        console.log('num');
        return 205;
      },
      'semantico': function(x){
        semantica.atributos[semantica.atributos.length-1].longitud = Number(x);
        return true;
      }
    },
    ')tipo': {
      'links': [')', 'cualidad', 'not', ','],
      'match': function (x) {
        return x == ')';
      },
      'state': false,
      'err': function(){
        console.log(')tipo');
        return [201, 205];
      },
      'semantico': function(x){
        return true;
      }
    },
    'cualidad': {
      'links':['cualidad', 'not', ',', ')'],
      'match': function(x){
        return x.match( /^(AUTO_INCREMENT|NULL)$/i);
      },
      'state': false,
      'err': function(){
        console.log('cualidad');
        return [201, 205];
      },
      'semantico': function(x){
        return true;
      }
    },
    'not': {
      'links':['null'],
      'match': function(x){
        return x.match( /^(NOT)$/i);
      },
      'state': false,
      'err': function(){
        console.log('not');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'null': {
      'links':['cualidad', ',', ')'],
      'match': function(x){
        return x.match( /^(NULL)$/i);
      },
      'state': false,
      'err': function(){
        console.log('null');
        return [201, 205];
      },
      'semantico': function(x){
        semantica.atributos[semantica.atributos.length-1].null=false;
        return true;
      }
    },
    ',': {
      'links':['primary', 'foreign', 'constraint', 'atrib'],
      'match': function(x){
        return x == ',';
      },
      'state': false,
      'err': function(){
        console.log(',');
        return [201, 204];
      },
      'semantico': function(x){
        return true;
      }
    },
    //Constraint
    'constraint':{
      'links':['identiConstraint'],
      'match': function(x){
        return x.match( /^(CONSTRAINT)$/i);
      },
      'state': false,
      'err': function(){
        console.log('constraint');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'identiConstraint':{
      'links':['primary', 'foreign'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$|^'([^'])*'$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('identiConstraint');
        return 201;
      },
      'semantico': function(x, linea){
        let idTabla = semantica.tabla.length-1;
        for(let i in semantica.restricciones){
          if(semantica.tabla[idTabla].nombre == semantica.restricciones[i].tabla && semantica.restricciones[i].nombre == x){
            updateInfoMessage(304, linea);
            return false;
          }
        }
        semantica.tabla[idTabla].restricciones++;
        semantica.restricciones.push({'tabla': semantica.tabla[idTabla].nombre, 'tipo': false, 'nombre': x, 'atrib': false, 'tRef': false, 'aRef': false});
        return true;
      }
    },
    //Primary
    'primary': {
      'links':['key1'],
      'match': function(x){
        return x.match( /^(PRIMARY)$/i);
      },
      'state': false,
      'err': function(){
        console.log('primary');
        return 201;
      },
      'semantico': function(x){
        if(!semantica.restricciones[semantica.restricciones.length-1].tipo){
            semantica.restricciones[semantica.restricciones.length-1].tipo = 1;
        }
        return true;
      }
    },
    'key1': {
      'links':['(primary'],
      'match': function(x){
        return x.match( /^(KEY)$/i);
      },
      'state': false,
      'err': function(){
        console.log('key1');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    '(primary': {
      'links':['atribPrimary'],
      'match': function(x){
        return x == '(';
      },
      'state': false,
      'err': function(){
        console.log('(primary');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'atribPrimary': {
      'links':[')primFore'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('atribPrimary');
        return 205;
      },
      'semantico': function(x, linea){
        var resId = semantica.restricciones.length-1;
        for(let i in semantica.atributos){
          if(semantica.atributos[i].tabla == semantica.restricciones[resId].tabla &&
            semantica.atributos[i].nombre == x){
              semantica.restricciones[resId].atrib = x;
              return true;
            }
        }
        updateInfoMessage(303, linea);
        return false;
      }
    },
    //Foreign
    'foreign': {
      'links':['key2'],
      'match': function(x){
        return x.match( /^(FOREIGN)$/i);
      },
      'state': false,
      'err': function(){
        console.log('foreign');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'key2': {
      'links':['(foreign'],
      'match': function(x){
        return x.match( /^(KEY)$/i);
      },
      'state': false,
      'err': function(){
        console.log('key2');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    '(foreign': {
      'links':['atribForeign'],
      'match': function(x){
        return x == '(';
      },
      'state': false,
      'err': function(){
        console.log('(foreign');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'atribForeign': {
      'links':[')foreign'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('atribForeign');
        return 205;
      },
      'semantico': function(x, linea){
        var resId = semantica.restricciones.length-1;
        for(let i in semantica.atributos){
          if(semantica.atributos[i].tabla == semantica.restricciones[resId].tabla &&
            semantica.atributos[i].nombre == x){
              semantica.restricciones[resId].atrib = x;
              return true;
            }
        }
        updateInfoMessage(303, linea);
        console.log(x, semantica);
        return false;
      }
    },
    ')foreign': {
      'links':['references'],
      'match': function(x){
        return x == ')'
      },
      'state': false,
      'err': function(){
        console.log(')foreign');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'references': {
      'links':['tableReferences'],
      'match': function(x){
        return x.match( /^(REFERENCES)$/i);
      },
      'state': false,
      'err': function(){
        console.log('references');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'tableReferences': {
      'links':['(foreign2'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('tableReferences');
        return 205;
      },
      'semantico': function(x, linea){
        let idRes = semantica.restricciones.length-1;
        for(let i in semantica.tabla){
          if(semantica.tabla[i].nombre == x){
            semantica.restricciones[idRes].tRef = x;
            return true;
          }
        }
        updateInfoMessage(305, linea);
        return false;
      }
    },
    '(foreign2': {
      'links':['atribRefereces'],
      'match': function(x){
        return x == '(';
      },
      'state': false,
      'err': function(){
        console.log('(foreign2');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'atribRefereces': {
      'links':[')primFore'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('atribRefereces');
        return 205;
      },
      'semantico': function(x, linea){
        let idRes = semantica.restricciones.length-1;
        for(let i in semantica.atributos){
          if(semantica.atributos[i].tabla == semantica.restricciones[idRes].tRef && semantica.atributos[i].nombre == x){
            for(let j in semantica.atributos){
              if(semantica.atributos[j].tabla == semantica.restricciones[idRes].tabla && semantica.atributos[j].nombre == semantica.restricciones[idRes].atrib){
                if(semantica.atributos[i].tipo == semantica.atributos[j].tipo){
                  if(semantica.atributos[i].longitud == semantica.atributos[j].longitud){
                    semantica.restricciones[idRes].aRef = x
                    return true;
                  }else{
                    updateInfoMessage(308, linea);
                    return false;
                  }
                }else{
                  updateInfoMessage(307, linea);
                  return false;
                }
              }
            }
          }
        }
        updateInfoMessage(305, linea)
        return false;
      }
    },
    ')primFore': {
      'links':[',', ')'],
      'match': function(x){
        return x == ')';
      },
      'state': false,
      'err': function(){
        console.log(')primFore');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    //End of query
    ')': {
      'links':[';'],
      'match': function(x){
        return x == ')';
      },
      'state': false,
      'err': function(){
        console.log(')');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    ';': {
      'state': true,
      'match': function(x){
        return x == ';';
      },
      'semantico': function(){
        return true;
      }
    }
  }
  DDL_INSERT = {
    'insert': {
      'links':['into'],
      'match': function(x){
        return x.match( /^(INSERT)$/i);
      },
      'state': false,
      'err': function(){
        console.log('insert');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'into': {
      'links':['tabla'],
      'match': function(x){
        return x.match( /^(INTO)$/i);
      },
      'state': false,
      'err': function(){
        console.log('into');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    'tabla': {
      'links':['values', '(1'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('tabla');
        return [201, 205];
      },
      'semantico': function(x, linea){
        insertStack.table = x;
        for(let i in semantica.tabla){
          if(semantica.tabla[i].nombre == x){
            insertStack.table = x;
            return true;
          }
        }
        updateInfoMessage(305,linea)
        return false;
      }
    },
    '(1': {
      'links':['atrib'],
      'match': function(x){
        return x == '('
      },
      'state': false,
      'err': function(){
        console.log('(1');
        return 204;
      },
      'semantico': function(x){
        insertStack.atribs = [];
        return true;
      }
    },
    'atrib': {
      'links':[',1', ')1'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^([A-Z])+([\w|\#])*$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('atrib');
        return 205;
      },
      'semantico': function(x, line){
        for(let i in insertStack.atribs){
          if(x == insertStack.atribs[i]){
            updateInfoMessage(302, line);
            return false;
          }
        }
        for(let i in semantica.atributos){
          if(insertStack.table == semantica.atributos[i].tabla &&
             semantica.atributos[i].nombre == x){
              insertStack.atribs.push(x);
              insertStack.values.push(semantica.atributos[i]);
              return true;
          }
        }
        updateInfoMessage(303, line);
        return false;
      }
    },
    ',1': {
      'links':['atrib'],
      'match': function(x){
        return x == ','
      },
      'state': false,
      'err': function(){
        console.log(',1');
        return 204;
      },
      'semantico': function(x){
        return true;
      }
    },
    ')1': {
      'links':['values'],
      'match': function(x){
        return x == ')'
      },
      'state': false,
      'err': function(){
        console.log(')1');
        return 201;
      },
      'semantico': function(x){
        return true;
      }
    },
    'values': {
      'links':['(2'],
      'match': function(x){
        return x.match( /^(VALUES)$/i);
      },
      'state': false,
      'err': function(){
        console.log('values');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    '(2': {
      'links':['constante'],
      'match': function(x){
        return x == '('
      },
      'state': false,
      'err': function(){
        console.log('(2');
        return 206;
      },
      'semantico': function(x){
        return true;
      }
    },
    'constante': {
      'links':[',2', ')2'],
      'match': function(x){
        if(sintacticTable[x]){
          return false;
        }else{
          return x.match( /^[+-]?\d+(\.\d+)?$|^'([^'])*'$/gi);
        }
      },
      'state': false,
      'err': function(){
        console.log('constante');
        return 205;
      },
      'semantico': function(x, line){
        let indx = insertStack.indx;
        if(!insertStack.atribs){
          insertStack.atribs = []
          for(let i in semantica.atributos){
            if(semantica.atributos[i].tabla == insertStack.table){
              insertStack.atribs.push(semantica.atributos[i].nombre);
              insertStack.values.push(semantica.atributos[i]);
            }
          }
        }
        if (indx >= insertStack.atribs.length) {
          updateInfoMessage(309, line)
          console.log('aqui', insertStack);
          return false;
        }
        if( (insertStack.values[indx].tipo == 'char' && x[0] == "\'") || (insertStack.values[indx].tipo == 'numeric' && x[0] != "\'") ){
          if(!insertStack.values[indx].longitud || (x.length - ((insertStack.values[indx].tipo == 'char')?2:0)) <= insertStack.values[indx].longitud){
            insertStack.indx++;
            return true;
          }else{
            updateInfoMessage(308, line);            
            return false;
          }
        }else{
          updateInfoMessage(307, line);
          return false;
        }
      }
    },
    ',2': {
      'links':['constante'],
      'match': function(x){
        return x == ','
      },
      'state': false,
      'err': function(){
        console.log(',2');
        return 206;
      },
      'semantico': function(x){
        return true;
      }
    },
    ')2': {
      'links':[';'],
      'match': function(x){
        return x == ')'
      },
      'state': false,
      'err': function(){
        console.log(')2');
        return 205;
      },
      'semantico': function(x){
        return true;
      }
    },
    ';': {
      'state': true,
      'match': function(x){
        return x == ';';
      },
      'semantico': function(){
        return true;
      }
    }
  }
  error_codes = {
    '101': {
      code:101,
      text: 'Símbolo desconocido',
      extraTxt: ''
    },
    '200': {
      code:200,
      text: 'Sin error',
      extraTxt: ''
    },
    '201': {
      code:201,
      text: 'Palabra Reservada',
      extraTxt: 'Se esperaba'
    },
    '204': {
      code:204,
      text: 'Identificador',
      extraTxt: 'Se esperaba'
    },
    '205': {
      code:205,
      text: 'Delimitador',
      extraTxt: 'Se esperaba'
    },
    '206': {
      code:206,
      text: 'Constante',
      extraTxt: 'Se esperaba'
    },
    '207': {
      code:207,
      text: 'Operador',
      extraTxt: 'Se esperaba'
    },
    '208': {
      code:208,
      text: 'Operador Relacional',
      extraTxt: 'Se esperaba'
    },
    '301': {
      code: 301,
      text: 'El tipo de dato no existe',
      extraTxt: ''
    },
    '302':{
      code: 302,
      text: 'El nombre de atributo se especifica más de una vez',
      extraTxt: ''
    },
    '303':{
      code: 303,
      text: 'El nombre de atributo no existe en la tabla',
      extraTxt: ''
    },
    '304': {
      code: 304,
      text: 'El nombre de restricción está duplicado',
      extraTxt: ''
    },
    '305':{
      code: 305,
      text: 'Se hace referencia a un atributo no válido',
      extraTxt: ''
    },
    '306':{
      code: 306,
      text: 'El nombre de la restricción está duplicado',
      extraTxt: ''
    },
    '307':{
      code: 307,
      text: 'Los valores especificados no corresponden',
      extraTxt: ''
    },
    '308': {
      code: 308,
      text: 'Los datos de cadena o binarios se truncarían',
      extraTxt: ''
    },
    '309': {
      code: 309,
      text: 'La cantidad de atributos no coincide con los valores',
      extraTxt: ''
    },
    '311': {
      code: 311,
      text: 'El nombre de atributo no es válido',
      extraTxt: ''
    },
    '312': {
      code: 312,
      text: 'El nombre de atributo es ambiguo',
      extraTxt: ''
    },
    '313': {
      code: 313,
      text: 'Conversión de tipo de dato',
      extraTxt: ''
    },
    '314': {
      code: 314,
      text: 'Nombre de objeto inválido',
      extraTxt: ''
    },
    '315':{
      code: 315,
      text: 'Identificador inválido',
      extraTxt: ''
    }
  }
  // Resizable panel
  paneles = Split(['#codeContainer', '#tableContainer'], {
    direction: 'vertical',
    sizes: [99, 1]
  });
  $tablaLexica_btn = $('#tablaLexica');
  $tableContainer = $( '#tableContainer > ul' );
  $tablaLexica_btn.click(function(event) {
    if(paneles.getSizes()[1]<=1){
      paneles.setSizes([70, 30]);
    }else{
      paneles.setSizes([99, 1]);
    }
  });

  // SQL language
  sqlSintax = {
    'comment': {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/).*)/,
      lookbehind: true
    },
    'string' : {
      pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\])*\2/,
      greedy: true,
      lookbehind: true
    },
    'variable': /@[\w.$]+|@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
    'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|NUMERIC|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
    'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
    'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
    'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    'punctuation': /[;[\]()`,.]/
  };

  flask = new CodeFlask('#my-code-wrapper', {
    language: 'sql',
    lineNumbers: true
  });
  flask.addLanguage('sql', sqlSintax);

  //Boton
  $runBtn = $('#runBtn');
  $runBtn.on('click', function(){
    tablaLexica = crearTabla(flask.getCode());
    if(!tablaLexica.error){
      imprimirTabla(tablaLexica, $tableContainer);
      if(paneles.getSizes()[1]<=1){
        paneles.setSizes([70, 30]);
      }
      checkSintax(tablaLexica);
    }else{
      updateInfoMessage(tablaLexica.code, tablaLexica.linea);
    }
  });

  $eraseBtn = $('#eraseDb');
  $eraseBtn.on('click', function() {
    semantica = {
      tabla:[],
      atributos:[],
      restricciones:[]
    }
    console.log(semantica);
    
  })
});

function imprimirTabla(data, target){
  target.html(`
    <li>
    <ul>
    <li>No.</li>
    <li>Token</li>
    <li>Línea</li>
    <li>Símbolo</li>
    <li>Valor</li>
    </ul>
    </li>`);
    data.forEach((d, i) =>{
      target.append(`
        <li>
        <ul>
        <li>${i+1}</li>
        <li>${d[0]}</li>
        <li>${d[1]}</li>
        <li>${d[2]}</li>
        <li>${d[3]}</li>
        </ul>
        </li>`);
      })
    }

    function updateInfoMessage(c, linea){
      if(c instanceof Array){
        paneles.setSizes([99, 1]);
        let string =   `<span class="stateTitle error">
        <i class="fa fa-times" aria-hidden="true"></i>
        Errror #${error_codes[c[0]].code}`;
        for(let i = 1; i<c.length;  i++){
          string += `${(i==c.length-1)?' o #':', #'}${error_codes[c[i]].code}`;
        }
        string +=`:
        </span>
        Error en línea
        <span>${linea}</span> ${error_codes[c[0]].extraTxt} <b><i>${error_codes[c[0]].text}</i></b>`;
        for(let i = 1; i<c.length;  i++){
          string += `${(i==c.length-1)?' o ':', '}<b><i>${error_codes[c[i]].text}</i></b>`;
        }
        $('#infoMessages').html(
          string
        );
      }else if(c === 200){
        $('#infoMessages').html(
          `<span class="stateTitle success"><i class="fa fa-check" aria-hidden="true"></i> Sin errores</span>`
        );
      }else{
        paneles.setSizes([99, 1]);
        $('#infoMessages').html(
          `<span class="stateTitle error">
          <i class="fa fa-times" aria-hidden="true"></i>
          Errror #${error_codes[c].code}:
          </span>
          Error en línea
          <span>${linea}</span> ${error_codes[c].extraTxt} <b><i>${error_codes[c].text}</i></b>`
        );
      }
    }
