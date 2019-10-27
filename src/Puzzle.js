import React, { Component } from 'react';
import originalImage from './images/main.png';
import './App.css';

class Puzzle extends Component {
  state = {
    pieces: [],
    shuffledBoard: [],
    orderedBoard: []
  };

  componentDidMount() {
    const pieces = [...Array(20)]
      .map((_, i) => (
        {
          img: `festival${i+1}.png`,
          order: i,
          board: 'shuffledBoard' 
        }
      ));
    this.setState({
      pieces,
      shuffledBoard: this.shuffle(pieces),
      orderedBoard: [...Array(20)]
    });
  }

  handleDrop(e, index, targetName) {
    let target = this.state[targetName];
    if (target[index]) return;

    const pieceOrder = e.dataTransfer.getData('text');
    const pieceData = this.state.pieces.find(p => p.order === +pieceOrder);
    const origin = this.state[pieceData.board];

    if (targetName === pieceData.board) target = origin;
    origin[origin.indexOf(pieceData)] = undefined;
    target[index] = pieceData;
    pieceData.board = targetName;

    this.setState({ [pieceData.board]: origin, [targetName]: target })
  }

  handleDrag(e, order) {
    const dt = e.dataTransfer;
    dt.setData('text/plain', order);
    dt.effectAllowed = 'move';
  }

  render() {
    return (
      <div className="puzzle">
        <ul className="shuffled-board">
          {this.state.shuffledBoard.map((piece, i) => this.showImg(piece, i, 'shuffledBoard'))}
        </ul>
        <ol className="ordered-board" style={{ backgroundImage: `url(${originalImage})` }}>
          {this.state.orderedBoard.map((piece, i) => this.showImg(piece, i, 'orderedBoard'))}
        </ol>
      </div>
    );
  }

  showImg(piece, index, boardName) {
    //console.log(`PIECE: ${piece} INDEX: ${index} BOARDNAME: ${boardName}`)
    return (
      <li
        key={index}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => this.handleDrop(e, index, boardName)}>
        {
          piece && <img
            draggable
            onDragStart={(e) => this.handleDrag(e, piece.order)}
            src={require(`./images/${piece.img}`)} />
        }
      </li>
    );
  }

  shuffle(pieces) {
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    return shuffled;
  }
}

export default Puzzle;