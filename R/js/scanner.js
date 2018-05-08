function crearTabla(cont) {
  /*
    Preparar el textbox para el analisis
  */

  //Separar por renglones
  let renglones = new Array();
  let ren = new Array();
  let resultados = new Array();
  // Se prepapra el texto para ser separado por saltos de línea
  cont = cont.split(/(\r\n|\n|\r)/gm); //Separa el texto por saltos de linea
  console.log(cont);
  
  //Generar renglones
  for(let i = 0; i<cont.length; i++){
    if (!cont[i].match(/(\r\n|\n|\r)/gm)){ //FILTRA PARA ELIMINAR LOS SALTOS BASURA
      // renglones.push(cont[i].split(/\s/gm));
      renglones.push(cont[i]);
    }
  }
  console.log(renglones);

  for(let i = 0; i<renglones.length; i++){
    if(renglones[i].replace(/\s/g,'')!=''){ //Limpiar los renglones vacios
      //Conseguir SQL_strings
      let temp = renglones[i].split(/(\')/);//Separar por comillas
      for(let j = 0; j<temp.length; j++){
        if(temp[j].replace(/\s/g,'')!=''){//Evita ingresar partes vacias al nuevo arreglo
          if(temp[j]=="'"){ //Si se encuentra un string de apertura
            if(temp[j+2]=="'"){ //Comprobar si hay cerradura en el mismo renglon
              ren.push(["'"+temp[j+1]+"'", i+1, 62]);
              j+=2;
            }else{
              console.log('No esta cerrado el texto');
              return false;
            }
          }else{
            ren.push([temp[j], i+1]);
          }
        }
      }
    }
  }
  console.log(ren);
  
  // //Separar elementos.
  // let tablita  = new Array();
  // //Resultados obtiene el valor de resultados
  // resultados.forEach( (n, i) =>{
  //   //Si esta dentro del lexema
  //   if(sintacticTable[n[1]]){
  //     console.log('LEXEMA');
  //     tablita.push(n);
  //   }else{
  //     let simbolo = /<|>|\+|\-|\*|\/|\,|\.|\(|\)|\=/g;
  //     // n[1].forEach( $ => {
  //     //   if($)
  //     // })
  //     let aux = '';
  //     let reservado = false;
  //     for(let i = 0; i<n[1].length; i++){
  //       if(n[1][i].match(simbolo)){
  //         if(reservado){
  //           tablita.push(aux);
  //           aux = '';
  //         }
  //         aux += n[1][i]
  //         if((aux == '<' || aux == '>') && n[1][i+1]==='='){
  //           aux += n[1][i+1];
  //           i++;
  //         }
  //         tablita.push(aux);
  //         aux = '';
  //         reservado = false;
  //       }else{
  //         reservado = true;
  //         aux+=n[1][i];
  //       }
  //     }
  //     if(aux!=''){
  //       tablita.push(aux);
  //     }
  //   }
  // });
  // console.log(tablita);
}