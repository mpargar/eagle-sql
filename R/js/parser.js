function checkSintax(sentencias, _ddl, _dml) {
    console.log(sentencias);
    let lim=0;
    for(let i = 0; i<sentencias.length; i++){
        if(sentencias[i][0] == ';' ){
            if(statement[0][0]=='SELECT'){
                checkStatement( sentencias.slice(lim, i+1), dml)
            }else if(statement[0][0] == 'INSERT' || statement[0][0] == 'CREATE'){
                checkStatement( sentencias.slice(lim, i+1), )
            }
            lim = i+1;
        }else if(i == sentencias.length-1){
            updateInfoMessage('205', sentencias[i][1]);
            return false;
        }
    }
}
function checkStatement(statement, type){
    let pital = new Array(199, type[1][1]);
    console.log(pila);    
}