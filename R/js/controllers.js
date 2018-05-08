//Variables
var flask;
var sintacticTable;
var tablaLexica;
var $tablaLexica_btn;
var $tableContainer;
var $runBtn;
var error_codes;
var DML;
var DDL;
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
    'select':{
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
  DML = [
    [null, 4, 8, 10, 11, 12, 13, 14, 15, 50, 51, 53, 54, 6, 1, 6, 2, 72, 199],
    [300, null, null, [10, 301, 11 , 306 , 310], null, null, null, null, null, null, null, null, null, null, null, null, null],
    [301, [302], null, null, null, null, null, null, null, null, null, null, null, null, null, [72], null],
    [302, [304, 303], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [303, null, null, null, [99], null, null, null, null, [50, 302], null, null, null, null, null, null, [99]],
    [304, [4, 305], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [305, null, [99], null, [99], null, [99], [99], [99], [99], [51, 4], [99], null, null, null, null, [99]],
    [306, [308, 307], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [307, null, null, null, null, [99], null, null, null, [50, 306], null, [99], null, null, null, null, [99]],
    [308, [4, 309], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [309, [4], null, null, null, [99], null, null, null, [99], null, [99], null, null, null, null, [99]],
    [310, null, null, null, null, [12, 311], null, null, null, null, null, [99], null, null, null, null, [99]],
    [311, [313, 312], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [312, null, null, null, null, null, null, [317, 311], [317, 311], null, null, [99], null, null, null, null, [99]],
    [313, [304, 314], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [314, null, [315, 316], null, null, null, [13, 52, 300, 53], null, null, null, null, null, null, null, null, null, null],
    [315, null, [8], null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [316, [304], null, null, null, null, null, null, null, null, null, null, [54, 318, 54], [319], null, null, null],
    [317, null, null, null, null, null, null, [14], [15], null, null, null, null, null, null, null, null],
    [318, null, null, null, null, null, null, null, null, null, null, null, null, null, 62, null, null],
    [319, null, null, null, null, null, null, null, null, null, null, null, null, [61], null, null, null]
  ];
  DDL = [
    [null, 4, 16, 18, 19, 20, 22, 24, 25, 26, 27, 50, 53, 54, 61, 199],
    [200, null, [16, 17, 4, 52, 202, 53, 55, 201], null, null, null, null, null, null, null, null, null, null, null, null, null],
    [201, null, 200, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [202, [4, 203, 52, 61, 53, 204, 205], null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [203, null, null, [18], [19], null, null, null, null, null, null, null, null, null, null, null],
    [204, null, null, null, null, [20, 21], null, null, null, null, null, [99], null, null, null, null],
    [205, null, null, null, null, null, null, null, null, null, null, [50, 207], [99], null, null, null],
    [206, [202], null, null, null, null, [207], null, null, null, null, null, null, null, null, null],
    [207, null, null, null, null, null, [22, 4, 208, 52, 4, 53, 209], null, null, null, null, null, null, null, null, null],
    [208, null, null, null, null, null, null, [24, 23], [25, 23], null, null, null, null, null, null, null],
    [209, null, null, null, null, null, null, null, null, [26, 4, 52, 4, 53, 210], null, [50, 207], [99], null, null, null],
    [210, null, null, null, null, null, null, null, null, null, null, [50, 207], [99], null, null, null],
    [211, null, null, null, null, null, null, null, null, null, [27, 28, 4, 29, 52, 2, 212, 53, 55, 215], null, null, null, null, null],
    [212, null, null, null, null, null, null, null, null, null, null, null, null, [213, 214], [213, 214], null],
    [213, null, null, null, null, null, null, null, null, null, null, null, null, [54, 62, 54], [61], null],
    [214, null, null, null, null, null, null, null, null, null, null, [50, 212], [99], null, null, null],
    [214, null, [200], null, null, null, null, null, null, null, [211], null, null, null, null, [99]],
    
  ]
  error_codes = {
    '101': {
      code:101,
      text: 'Símbolo desconocido.'  
    },
    '200': {
      code:200,
      text: 'Sin error.'  
    },
    '201': {
      code:201,
      text: 'Se es peraba Palabra Reservada.'  
    },
    '204': {
      code:204,
      text: 'Se esperaba Identificador.'  
    },
    '205': {
      code:205,
      text: 'Se esperaba Delimitador.'  
    },
    '206': {
      code:206,
      text: 'Se esperaba Constante.'  
    },
    '207': {
      code:207,
      text: 'Se esperaba Operador.'  
    },
    '208': {
      code:208,
      text: 'Se esperaba Operador Relacional.'  
    }
  }

  // Resizable panel
  var paneles = Split(['#codeContainer', '#tableContainer'], {
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
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
      lookbehind: true
    },
    'string' : {
      pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\])*\2/,
      greedy: true,
      lookbehind: true
    },
    'variable': /@[\w.$]+|@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
    'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
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
        checkSintax(tablaLexica, DDL, DML);
      }
    }else{
      updateInfoMessage(tablaLexica.code, tablaLexica.linea);
    }
  });
});

function updateInfoMessage(c, linea){
  if(c === 200){
    $('#infoMessages').html(
      `<span class="stateTitle success"><i class="fa fa-check" aria-hidden="true"></i> Sin errores</span>`
    );
  }else{
    $('#infoMessages').html(
      `<span class="stateTitle error">
        <i class="fa fa-times" aria-hidden="true"></i> 
        Errror #${error_codes[c].code}:
       </span>
      Error en línea
      <span>${linea}</span> ${error_codes[c].text}`
    );
  }
}
