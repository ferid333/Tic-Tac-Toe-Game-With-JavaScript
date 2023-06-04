const cells=document.querySelectorAll(".cell")
const cell=document.querySelector(".cells")
const endtext=document.querySelector(".endtext")
const reset=document.querySelector(".reset")

class Main{
constructor(){
this.turn="cross"
this.winnerIndexs=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]]
this.gameBoard=Array.from(cell.children)
this.virtualBoard= Array.from(Array(9).keys())
this.players={
    aiplayer:"circle",
    userplayer:"cross"
}
}

addsymbol(item_index){
    if(typeof this.virtualBoard[item_index] =="number"){
        cell.classList.replace(this.turn,this.turn=="cross" ?"circle" : "cross")
        this.virtualBoard[item_index]=this.turn
       this.addBoard()
        if(this.checkTie()){
            this.endGame("Draw")
        }
        else if(this.checkWin(this.virtualBoard,this.turn)){
            this.endGame(this.turn)
        }
        this.turnChange()
      }
}
addBoard(){
    this.gameBoard.forEach((item,index)=>{
        if(typeof this.virtualBoard[index] !="number")
      item.classList.add(this.virtualBoard[index])
     })
}


turnChange(){
 this.turn=="cross" ? this.turn="circle" : this.turn="cross"
 if(this.turn==this.players.aiplayer){
    let ai_move=this.bestSpot(this.virtualBoard,this.players.aiplayer)
    this.addsymbol(ai_move)
 }
}

endGame(winner){
    endtext.parentElement.style.display="flex"
    winner=="cross" ?   endtext.textContent="Cross Win !" : winner=="circle" ? endtext.textContent="Circle Win !" : endtext.textContent="Draw!" 
}
checkTie(){
    let available_cells=this.getAvailableCells(this.virtualBoard)
    return available_cells.length == 0
}
checkWin(gameboard,player){
    let t=0
        for (let i = 0; i < this.winnerIndexs.length; i++) {
            t=0
            this.winnerIndexs[i].forEach(index=>{
                if(gameboard[index]==player){
                    t++
                }
            })
            if (t==3 ){ 
               return true
            }
        }
       return false
}
bestSpot(gameboard,player){
    return this.minmax(gameboard,player).index
}
minmax(gameboard,player){
    let available_cells=this.getAvailableCells(this.virtualBoard)

    if(this.checkWin(gameboard,this.players.userplayer)){
       return {score:-10}
    }
    else if (this.checkWin(gameboard,this.players.aiplayer)){
        return {score:10}
    }
    else if(available_cells.length==0){
        return {score :0}
    }

    var moves=[]

    for (let i = 0; i < available_cells.length; i++) {
        var move={}
        move.index=gameboard[available_cells[i]]
        gameboard[available_cells[i]]=player
        if(player==this.players.aiplayer){
            let result=this.minmax(gameboard,this.players.userplayer)
            move.score = result.score
        }
        else {
            let result=this.minmax(gameboard,this.players.aiplayer)
            move.score = result.score
        }
        gameboard[available_cells[i]]=move.index
        moves.push(move)
    }
    var bestmove;
    if(player==this.players.aiplayer){
        let bestscore=-1000
        for (let i = 0; i < moves.length; i++) {
           
           if(moves[i].score>bestscore){
            bestscore=moves[i].score
            bestmove=i
           }
        }
    }
  else{
    let bestscore=1000
    for (let i = 0; i < moves.length; i++) {
        
       if(moves[i].score<bestscore){
        bestscore=moves[i].score
        bestmove=i
       }
    }
  }
  return moves[bestmove]
}
getAvailableCells(gameboard){
   return gameboard.filter(s => typeof s=="number")
}
reset_game(){
    this.gameBoard.forEach(item=>{
        item.classList.remove('circle', 'cross')
        cell.classList.replace('circle', 'cross')
        endtext.parentElement.style.display="none"
        this.turn="cross"
    })
    this.virtualBoard=Array.from(Array(9).keys())
}
}



class Click extends Main{
    constructor(){
        super()
        cells.forEach(item=>{
            item.addEventListener("click",this.addsymbol.bind(this,item.getAttribute('id').split("_")[1]))
        })
        reset.addEventListener("click",this.reset_game.bind(this))
    }
}


const click=new Click()