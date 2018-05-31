function checkSintax(sentencias) {
  let lim = 0;
  for(let i = 0; i<sentencias.length; i++){
    semantica_copy = JSON.parse(JSON.stringify(semantica));
    if(sentencias[i][0]==';'){
      if(checkStatement(sentencias.slice(lim, i + 1))){
        lim = i+1;
      }else{
        semantica = JSON.parse(JSON.stringify(semantica_copy));
        return false;
      }
    }
  }
  if(lim<sentencias.length){
    updateInfoMessage(205,sentencias[sentencias.length-1][1]);
    return false;
  }else{
    updateInfoMessage(200);
    return true;
  }
}

function checkStatement(statement){
  let pila = new Array();
  let arbol;
  if(statement[0][0].toLowerCase()=='select'){
    arbol = DML;
    apun = 'select';
  }else if(statement[0][0].toLowerCase()=='create'){
    arbol = DDL_CREATE;
    apun = 'create';
  }else if(statement[0][0].toLowerCase()=='insert'){
    arbol = DDL_INSERT;
    apun = 'insert';
  }
  else{
    updateInfoMessage(201, statement[0][1]);
    return false;
  }
  for(let i = 1; i<statement.length; i++){
    if(statement[i][0]=='('){
      pila.push('(');
    }else if(statement[i][0]==')'){
      if(pila.length == 0){
        updateInfoMessage(205, statement[statement.length-1][1]);
        return false;
      }else{
        pila.pop();
      }
    }
    if(!stMatch(statement[i], arbol, apun, this)){
      return false;
    }
  }
  if(pila.length==0){
    return true;
  }else{
    updateInfoMessage(205, statement[statement.length-1][1]);
    return false;
  }
}

function stMatch(st, ar, ap, ctx){ //statement, arbol, apuntador, contexto
  for(let j = 0; j<ar[ap].links.length; j++){
    let s = ar[ap].links[j];
    if(ar[s].match(st[0].toLowerCase())){
      if(ar[s].semantico(st[0].toLowerCase(), st[1])){
        ctx.apun = s;
        return true;
      }else{
        return false;
      }
    }
  }
  updateInfoMessage(ar[apun].err(), st[1]);
  return false;
}
