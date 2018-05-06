function crearTabla(cont) {
  /*
    Preparar el textbox para el analisis
  */
  let renglones = new Array();
  let resultados = new Array();
  // Se prepapra el texto para ser separado por saltos de línea
  cont = cont.split(/(\r\n|\n|\r)/gm); //Separa el texto por saltos de linea
  for(let i = 0; i<cont.length; i++){
    if (cont[i].match(/(\r\n|\n|\r)/gm)==null){ //FILTRA PARA ELIMINAR LOS SALTOS BASURA
      renglones.push(cont[i].split(/\s/gm));
    }
  }
  //Filtra para limpiar los espacios
  for(let i = 0; i<renglones.length; i++){
    for(let j = 0; j<renglones[i].length; j++){
      if(renglones[i][j]!='' && renglones[i][j]!=' ')
        resultados.push([i+1, renglones[i][j].toLowerCase()])
    }
  }
  console.log(resultados);
  return resultados;
}
