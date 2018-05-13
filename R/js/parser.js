function checkSintax(sentencias) {
    let lim = 0;
    for(let i = 0; i<sentencias.length; i++){
        if(sentencias[i][0]==';'){
            console.log(sentencias.slice(lim, i + 1));
            lim = i+1; 
        }
    }
    if(lim<sentencias.length-1){
        console.log(sentencias.slice(lim, sentencias.length));
    }
}

function checkStatement(statement){
    let type = ( (statement[0][0] == 'CREATE' || statement[0][0] == 'CREATE') ? DDL : ((statement[0][0] == 'SELECT')?DML:FALSE) );
    if(type){
        
    }
}