const RemoveElementLista = (listas: any[], value: any) => {
    for(let i = 0; i < listas.length; i++) {
        if(listas[i]._id === value){
            listas.splice(i, 1)
        }
    }
    return listas
}


export {
    RemoveElementLista
}