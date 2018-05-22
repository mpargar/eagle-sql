//Variables
var flask;
var sintacticTable;
var tablaLexica;
var $tablaLexica_btn;
var $tableContainer;
var $runBtn;
var error_codes;
var DML;
var DDL_CREATE;
var DDL_INSERT;
var paneles;
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
      }
    },
    ';': {
      'state': true,
      'match': function(x){
        return x == ';';
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
      }
    },
    ';': {
      'state': true,
      'match': function(x){
        return x == ';';
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
      }
    },
    ';': {
      'state': true,
      'match': function(x){
        return x == ';';
      }
    }
  }
  error_codes = {
    '101': {
      code:101,
      text: 'Símbolo desconocido'
    },
    '200': {
      code:200,
      text: 'Sin error'
    },
    '201': {
      code:201,
      text: 'Palabra Reservada'
    },
    '204': {
      code:204,
      text: 'Identificador'
    },
    '205': {
      code:205,
      text: 'Delimitador'
    },
    '206': {
      code:206,
      text: 'Constante'
    },
    '207': {
      code:207,
      text: 'Operador'
    },
    '208': {
      code:208,
      text: 'Operador Relacional'
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
      if(checkSintax(tablaLexica)){

      }
    }else{
      updateInfoMessage(tablaLexica.code, tablaLexica.linea);
    }
  });
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
        <span>${linea}</span> Se esperaba <b><i>${error_codes[c[0]].text}</i></b>`;
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
          <span>${linea}</span> Se esperaba <b><i>${error_codes[c].text}</i></b>`
        );
      }
    }
