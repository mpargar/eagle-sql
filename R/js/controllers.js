//Variables
var flask;
var sintacticTable;
var tablaLexica;
var $tablaLexica_btn;
var $tableContainer;
var $runBtn;

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
    }else{
      //Imprimir .info
    }
  });
});
