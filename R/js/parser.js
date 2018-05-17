function checkSintax(sentencias) {
  let lim = 0;
  for(let i = 0; i<sentencias.length; i++){
    if(sentencias[i][0]==';'){
      if(checkStatement(sentencias.slice(lim, i + 1))){
        lim = i+1;
      }else{
        return false;
      }
    }
  }
  if(lim<sentencias.length){
    updateInfoMessage(205,sentencias[sentencias.length-1][1]);
    return false;
  }else{
    updateInfoMessage(200);
  }
}

function checkStatement(statement){
  let pila = [];
  let arbol;
  if(statement[0][0].toLowerCase()=='select'){
    arbol = DML;
    apun = 'select'
  }else{
    updateInfoMessage(201, statement[0][1]);
    return false;
  }
  for(let i = 1; i<statement.length; i++){
    if(!stMatch(statement[i], arbol, apun, this)){
      return false;
    }
  }
  return true;
}

function stMatch(st, ar, ap, ctx){ //statement, arbol, apuntador, contexto
  for(let j = 0; j<ar[ap].links.length; j++){
    let s = ar[ap].links[j];
    if(ar[s].match(st[0], ctx)){
      ctx.apun = s;
      return true;
    }
  }
  updateInfoMessage(ar[apun].err(), st[1]);
  return false;
}
