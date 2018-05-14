function checkSintax(sentencias) {
    let lim = 0;
    for(let i = 0; i<sentencias.length; i++){
        if(sentencias[i][0]==';'){
            if(checkStatement(sentencias.slice(lim, i + 1))){
              lim = i+1;
            }else{
              console.log('Check sintax 1 -----> Error');
              return false;
            }
        }
    }
    if(lim<sentencias.length){
        console.log('Check sintax 1 -----> Error');
        return false;
    }else{
      console.log('Todo chido');
    }
}

function esTerminal(n, sntx){
    for(let i = 1; i<sntx[0].length; i++){
        if(n==sntx[0][i]){
            return true;
        }
    }
    return false;
}

function matrizHasProduction(sntx, x1, k1){
    console.log("AWASWEEEEY ->>>>>");
    for(let i = 1; i<sntx[0].length; i++){
      console.log(k1, sntx[0][i]);
        if(k1==sntx[0][i]){
            for(let j = 1; j<sntx.length; j++){
                if(x1==sntx[j][0]){
                    return sntx[j][i];
                }
            }
            console.log('Matriz 2 -----> Error');
            return false;
        }
    }
    console.log(`Matriz 1 -----> Error --> ${k1}`);
    return false;
}

function checkStatement(statement){
  console.log(statement);
    let sintax = ( (statement[0][2] == 27 || statement[0][2] == 16) ? DDL : ((statement[0][2] == 10)?DML:false) );
    if(sintax){
        let pila = new Array(199, ((statement[0][2] == 10) ? 300 : 200) );
        statement.push(new Array(199, statement[statement.length-1][1],199,199));
        let apun = 0;
        let x;
        let k;
        do{
            x = pila.pop();
            k = statement[apun][2];
            if(esTerminal(x, sintax)){
                if(x==k){
                    apun++;
                }else{
                    console.log('1 -----> Error');
                    return false;
                }
            }else{
                let production = matrizHasProduction(sintax, x, k);
                if(production){
                  if(production != 99){
                    for(let i = production.length-1; i>=0; i--){
                      pila.push(production[i]);
                    }
                  }
                }else{
                  console.log('2 -----> Error');
                  return false;
                }
            }
        }while(x != 199);
    }else{
      console.log('Statement -----> Error');
      return false;
    }
    return false;
}
