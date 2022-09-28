import React from 'react';
import Board from './Board';
const size=10;
const w = 5;
class Game extends React.Component {
        constructor(){
            super();
            this.state = {
          history: [{
            squares: Array(100).fill(null),
            moveLocation: '', 
          }],
          xIsNext: true,
          stepNumber: 0,
          isReverse: false,
        };
      }
      changeReverse(isReverse){
        this.setState({
          isReverse: !isReverse
        });
      }
      handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
          return;
        }
    
        const matrixSize = Math.sqrt(history[0].squares.length);
        const moveLocation = [Math.floor(i / matrixSize) + 1, (i % matrixSize) + 1].join(", "); 
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            moveLocation: moveLocation,
          }]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length
        });
      }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const squares = current.squares;  
      const isReverse = this.state.isReverse;  
  
      let status;
      if(winner){
        status = "The winner is: " + winner.winnerPlayer;;
      }else if(this.state.stepNumber === 100){ 
        status = "Draw match"; 
      }else{
        status = "Next player is: " + (this.state.xIsNext ? 'X' : 'O');
      }
      const moves = history.map((step, move) => {
        const description = move ? `Move #${move} (${step.moveLocation})` : 'START'; 
       return ( <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{description}</button>
      </li>)
      });
      return(
        <div>
          <div className="game">
            <Board squares={squares} onClick={i => this.handleClick(i)} winner={winner && winner.winnerLocation}/>
          </div>
          <div className="game-info">
            <p>{status}</p>
            <ol reversed={isReverse ? 'reverse' :''}>{isReverse ? moves.reverse() : moves}</ol>
            <button onClick={() => this.changeReverse(isReverse)}>Reverse moves</button>
          </div>
        </div>
      );
    }
  }

export default Game;

function calculateWinner(squares) {
  let win;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      
      if (!squares[i*size+j]) continue;
      if (j <= size - w) {
        win = true;
        for (let k = 0; k < w - 1; k++) {
          if (squares[i*size+j + k] !== squares[i*size+j + k + 1]) {
            win = false
          }
        }
        if (win) return {  winnerPlayer: squares[i*size+j],
          winnerLocation: [i*size+j,i*size+j+1,i*size+j+2,i*size+j+3,i*size+j+4]};
      }
      if (i <= size - w) {
        win = true;
        for (let k = 0; k < w - 1; k++) {
          if (squares[(i + k)*size+j] !== squares[(i + k + 1)*size+j]) {
            win = false
          }
        }
        if (win) return {  winnerPlayer: squares[i*size+j],
          winnerLocation: [i*size+j,i*size+j+size,i*size+j+2*size,i*size+j+3*size,i*size+j+4*size]};
        }
      
      if (j <= size - w && i <= size - w) {
        win = true;
        for (let k = 0; k < w - 1; k++) {
          if (squares[(i + k)*size+j + k] !== squares[(i + k + 1)*size+j + k + 1]) {
            win = false
          }
        }
        if (win) return {  winnerPlayer: squares[i*size+j],
          winnerLocation: [i*size+j,(i+1)*size+j+1,(2+i)*size+j+2,(i+3)*size+j+3,(i+4)*size+j+4]};
  }
    if (i <= size - w && j >= w - 1) {
       win = true;
      for (let k = 0; k < w - 1; k++) {
         if (squares[(i + k)*size+j - k] !== squares[(i + k + 1)*size+j - k - 1]) {
            win = false
       }
      }
      if (win) return {  winnerPlayer: squares[i*size+j],
         winnerLocation: [i*size+j,(i+1)*size+j-1,(2+i)*size+j-2,(i+3)*size+j-3,(i+4)*size+j-4]};
      }
     }
  }
  return null;
}