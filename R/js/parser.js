function checkSintax(sentencias) {
    let lim = 0;
    for(let i = 0; i<sentencias.length; i++){
        if(sentencias[i][0]==';'){
            console.log(sentencias.slice(lim, i + 1));
            if(checkStatement(sentencias.slice(lim, i + 1))){
                // Print error
                return false;
            }else{
                lim = i+1; 
            }
        }
    }

    if(lim<sentencias.length){
        console.log(sentencias.slice(lim, sentencias.length));
        //Print error
        return false;
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
    for(let i = 1; i<sntx[0]; i++){
        if(k1==sntx[0][i]){
            for(let j = 1; j<sntx.length; j++){
                if(x1==sntx[j][0]){
                    return sntx[j][i];
                }
            }
            return false;
        }
    }
    return false;
}

function checkStatement(statement){
    let sintax = ( (statement[0][2] == 27 || statement[0][2] == 16) ? DDL : ((statement[0][2] == 10)?DML:false) );
    if(sintax){
        let pila = new Array(199, ((statement[0][2] == 10) ? 300 : 200) );
        statement.append(new Array(199, statement[statement.length-1][1],199,199));
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
                    //Print Error
                }     
            }else{
                if(matrizHasProduction(sintax, x, k)){

                }else{
                    //Print Error
                }
            }
        }while(x != 199);
    }else{
        //Print error
    }
    return false;
}