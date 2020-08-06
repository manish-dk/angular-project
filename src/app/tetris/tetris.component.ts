/*
*  Ported from my old pure JS version so very messy
*  Would do this differently if starting from scratch today
*/
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css']
})
export class TetrisComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  

  private ctx: CanvasRenderingContext2D;

  p: number = 20;
  x: number = 0.5 + 12 * this.p;
  y: number = 0.5;
  height:number = 21;
  width:number = 16;
  floor: number = 0.5 + (this.height - 1) * this.p; //600.5, 380.5, 0.5 = coordinates of board
  leftBorder:number = 0.5;
  rightBorder:number = 0.5 + this.width * (this.p -1);
  tickrate:number = 500;
  score:number = 0;
  inDelay:boolean = false;
  gameEnded:boolean = true;

  //tetrominos
  line = { state: 1, colour: "red", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x, this.y - 2 * this.p], [this.x, this.y - 3 * this.p]] };
  square = { colour: "yellow", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x - this.p, this.y], [this.x - this.p, this.y - this.p]] };
  t = { state: 1, colour: "aqua", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x - this.p, this.y - this.p], [this.x + this.p, this.y - this.p]] };
  s = { state: 1, colour: "aquamarine", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x - this.p, this.y], [this.x + this.p, this.y - this.p]] };
  z = { state: 1, colour: "greenyellow", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x + this.p, this.y], [this.x - this.p, this.y - this.p]] };
  l = { state: 1, colour: "pink", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x, this.y - 2 * this.p], [this.x + this.p, this.y]] };
  j = { state: 1, colour: "orange", blocks: [[this.x, this.y], [this.x, this.y - this.p], [this.x, this.y - 2 * this.p], [this.x - this.p, this.y]] };

  tetrominos = [this.line, this.square, this.t, this.s, this.z, this.l, this.j];
  //tetrominos = [l, j];
  current = JSON.parse(JSON.stringify(this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)]));
  past = [];
  gameDown;
  gameRefresh;
  speedUp;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.height = 0.5 + this.height * this.p;
    this.canvas.nativeElement.width = 0.5 + this.width * this.p;
    this.drawboard();
    
  }

  ngAfterViewInit(): void {
    
      
  }

  begin():void {
    this.reset();
    this.gameEnded = false;
    this.gameDown = setInterval(this.downtick, this.tickrate);
    this.gameRefresh = setInterval(this.refresh, this.tickrate);

  }

  continue():void {
    this.gameDown = setInterval(this.downtick, this.tickrate);
    this.gameRefresh = setInterval(this.refresh, this.tickrate);

  }
  reset():void{
    clearInterval(this.gameDown);
    clearInterval(this.gameRefresh);
    clearInterval(this.speedUp);
    this.current = JSON.parse(JSON.stringify(this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)]));
    this.tickrate = 500;
    this.gameEnded =true;
    this.past = [];
    this.score = 0;
    this.ngOnInit();
  }

  endGame() {
    clearInterval(this.gameDown);
    clearInterval(this.gameRefresh);
    clearInterval(this.speedUp);
    this.current = JSON.parse(JSON.stringify(this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)]));
    this.tickrate = 500;
    this.gameEnded =true;
    window.alert(`Game Over Score: ${this.score}`);
  }

  downtick = () => {
    this.changeTick();
    for (let i = 0; i < this.current.blocks.length; i++) {
      this.current.blocks[i][1] = this.current.blocks[i][1] < this.floor - this.p ? this.current.blocks[i][1] + this.p : this.floor;
    }
    this.refreshFromKey();
  }

  changeTick(){
      if(this.tickrate > 50) {
          this.tickrate -= 1;
      }
  }

  refresh = () => {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawboard();
    this.drawCurrent();
    this.checkLine();
    this.drawPast();
    clearInterval(this.gameDown);
    clearInterval(this.gameRefresh);
    this.gameDown = setInterval(this.downtick, this.tickrate);
    this.gameRefresh = setInterval(this.refresh, this.tickrate);
    
  }

  refreshFromKey = () => {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawboard();
    this.drawCurrent();
    
    this.checkLine();
    this.drawPast();
    this.checkCollision();
    
  }

 drawboard = () => {
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.02;
    for (let start = 0; start < this.canvas.nativeElement.width; start += this.p) {
        this.ctx.moveTo(start + 0.5, 0.5);
        this.ctx.lineTo(start, this.canvas.nativeElement.height + 5 * this.p);
        this.ctx.strokeStyle = "black";

        this.ctx.stroke();
    }
    for (let start = 0; start < this.canvas.nativeElement.height + 10 * this.p; start += this.p) {
        this.ctx.moveTo(0.5, start + 0.5);
        this.ctx.lineTo(this.canvas.nativeElement.width + 3 * this.p, start);
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }

  }


  @HostListener('window:keydown', ['$event'])
  handleEvent = (event: KeyboardEvent) => {
    if (event.keyCode == 38) { //119
        if (this.gameEnded) return;
        this.rotate();
        this.refreshFromKey();

    }
    if (event.keyCode == 37) {
        if (!this.checkMove(-1) || this.gameEnded) return;
        for (let i = 0; i < this.current.blocks.length; i++) {
          this.current.blocks[i][0] -= this.p;
        }
        this.refreshFromKey();
    }
    if (event.keyCode == 39) {
        if (!this.checkMove(1) || this.gameEnded) return;
        for (let i = 0; i < this.current.blocks.length; i++) {
          this.current.blocks[i][0] += this.p;
        }
        this.refreshFromKey();
    }
    if (event.keyCode == 40) {
        if(this.inDelay || this.gameEnded){
            return;
        }
        for (let i = 0; i < this.current.blocks.length; i++) {
          this.current.blocks[i][1] = this.current.blocks[i][1] < this.floor - this.p ? this.current.blocks[i][1] + this.p : this.floor;
        }
        this.refreshFromKey();
    }
  }


  

  drawCurrent = () => {
    this.ctx.fillStyle = this.current.colour;
    for (let i = 0; i < this.current.blocks.length; i++) {
        this.ctx.fillRect(this.current.blocks[i][0], this.current.blocks[i][1], this.p, this.p);
    }
  }

  storetetromino = async (tetromino) => {
        this.past.push(tetromino);
        this.current = JSON.parse(JSON.stringify(this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)]));
  }

  checkLine = () =>  {
    for (let yline = this.floor; yline > 0; yline -= this.p) {
        let count = 0;
        for (let xline = 0.5; xline <= this.rightBorder; xline += this.p) {


            for (let i = 0; i < this.past.length; i++) {
                for (let j = 0; j < this.past[i].blocks.length; j++) {
                    if (this.past[i].blocks[j][1] == yline && this.past[i].blocks[j][0] == xline) {
                        count++;
                        if (count == this.width) this.destroyLine(yline);
                        break;

                    }
                }

            }
        }
    }
  }

  destroyLine = (yline) => {
    this.score += 100;
    let xarray = [];
    for (let i = 0; i < this.past.length; i++) {
        for (let j = 0; j < this.past[i].blocks.length; j++) {
            
            if (this.past[i].blocks[j][1] == yline) {
                xarray.push(this.past[i].blocks[j][0]);
                this.past[i].blocks.splice(j, 1);
                j--;
            }
        }
    }
        for (let i = 0; i < this.past.length; i++) {
            for (let j = 0; j < this.past[i].blocks.length; j++) {
                if (this.past[i].blocks[j][1] < yline){
                    this.past[i].blocks[j][1] += this.p;
                }
            }
        }
    }

  

  checkCollisionWithoutDelay =  () => {
    for (let i = 0; i < this.past.length; i++) {
        for (let j = 0; j < this.past[i].blocks.length; j++) {
            if (this.past[i].blocks[j][0] == this.current.blocks[0][0] && this.past[i].blocks[j][1] == this.current.blocks[0][1] + this.p
                || this.past[i].blocks[j][0] == this.current.blocks[1][0] && this.past[i].blocks[j][1] == this.current.blocks[1][1] + this.p
                || this.past[i].blocks[j][0] == this.current.blocks[2][0] && this.past[i].blocks[j][1] == this.current.blocks[2][1] + this.p
                || this.past[i].blocks[j][0] == this.current.blocks[3][0] && this.past[i].blocks[j][1] == this.current.blocks[3][1] + this.p) {

                    for (let i = 0; i < 4; i++) {
                        if (0.5 > this.current.blocks[i][1]) {
                            this.endGame();
                            return true;
                        }
                    }
                    this.storetetromino(this.current);
                    this.continue();
                    return true;
            }
        }
    }
    for (let i = 0; i < this.current.blocks.length; i++) {
        if (this.current.blocks[i][1] == this.floor) {
            if(this.inDelay == false){

                this.storetetromino(this.current);
                this.continue();
                return true;
            }
        }
    }
    this.continue();
    return false;
  }

  checkCollision = async () => {
    for (let i = 0; i < this.past.length; i++) {
        for (let j = 0; j < this.past[i].blocks.length; j++) {
            if (this.past[i].blocks[j][0] == this.current.blocks[0][0] && this.past[i].blocks[j][1] == this.current.blocks[0][1] + this.p
                || this.past[i].blocks[j][0] == this.current.blocks[1][0] && this.past[i].blocks[j][1] == this.current.blocks[1][1] + this.p
                || this.past[i].blocks[j][0] == this.current.blocks[2][0] && this.past[i].blocks[j][1] == this.current.blocks[2][1] + this.p
                || this.past[i].blocks[j][0] == this.current.blocks[3][0] && this.past[i].blocks[j][1] == this.current.blocks[3][1] + this.p) {

                    if (0.5 > this.current.blocks[0][1]) {
                        this.endGame();
                        return true;
                    }
                    if(this.inDelay == false){

                        clearInterval(this.gameDown);
                        clearInterval(this.gameRefresh);
                        this.inDelay = true;
                        await this.delay(this.tickrate);
                        this.inDelay = false;
                        this.checkCollisionWithoutDelay();
                        return true;
                    }
            }
        }
    }
    for (let i = 0; i < this.current.blocks.length; i++) {
        if (this.current.blocks[i][1] == this.floor) {
            if(this.inDelay == false){

                clearInterval(this.gameDown);
                clearInterval(this.gameRefresh);
                this.inDelay = true;
                await this.delay(this.tickrate);
                this.inDelay = false;
                this.checkCollisionWithoutDelay();
                return true;
            }
        }
    }
    return false;
  }

  checkMove = (x) => {
    for (let i = 0; i < 4; i++) {
        if(x == 1){
            if (this.rightBorder - this.p < this.current.blocks[i][0]){
                return false;
            }
        }
        else {
            if (this.leftBorder + this.p > this.current.blocks[i][0]) {
                return false;
        }
    }
        
    }
    for (let i = 0; i < this.past.length; i++) {
        for (let j = 0; j < this.past[i].blocks.length; j++) {
            if (this.past[i].blocks[j][0] == this.current.blocks[0][0] + x * this.p && this.past[i].blocks[j][1] == this.current.blocks[0][1]
                || this.past[i].blocks[j][0] == this.current.blocks[1][0] + x * this.p && this.past[i].blocks[j][1] == this.current.blocks[1][1]
                || this.past[i].blocks[j][0] == this.current.blocks[2][0] + x * this.p && this.past[i].blocks[j][1] == this.current.blocks[2][1]
                || this.past[i].blocks[j][0] == this.current.blocks[3][0] + x * this.p && this.past[i].blocks[j][1] == this.current.blocks[3][1]) {
                return false;
            }
        }
    }
    return true;
  }

  delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  drawPast = () => {
    this.past.forEach( (tetromino) => {
        this.ctx.fillStyle = tetromino.colour;
        for (let i = 0; i < tetromino.blocks.length; i++) {
            this.ctx.fillRect(tetromino.blocks[i][0], tetromino.blocks[i][1], this.p, this.p);
        }
    });
    
  }

  rotate = () => {
    let proposed = JSON.parse(JSON.stringify(this.current));
    if (proposed.colour == "red") {
        if (proposed.state == 1) {
            proposed.blocks[0][0] -= this.p;
            proposed.blocks[0][1] -= this.p;
            proposed.blocks[2][0] += this.p;
            proposed.blocks[2][1] += this.p;
            proposed.blocks[3][0] += 2 * this.p;
            proposed.blocks[3][1] += 2 * this.p;
            proposed.state = 2;
        }
        else if (proposed.state == 2) {
            proposed.blocks[0][0] += this.p;
            proposed.blocks[0][1] += this.p;
            proposed.blocks[2][0] -= this.p;
            proposed.blocks[2][1] -= this.p;
            proposed.blocks[3][0] -= 2 * this.p;
            proposed.blocks[3][1] -= 2 * this.p;
            proposed.state = 1;
        }

    }
    else if (proposed.colour == "aqua") {
        if (proposed.state == 1) {
            proposed.blocks[0][1] -= 2 * this.p;
            proposed.state = 2;
        }
        else if (proposed.state == 2) {
            proposed.blocks[3][0] -= this.p;
            proposed.blocks[3][1] += this.p;
            proposed.state = 3;
        }
        else if (proposed.state == 3) {
            proposed.blocks[2][0] += 2 * this.p;
            proposed.state = 4;
        }
        else if (proposed.state == 4) {
            proposed.blocks[0][1] += 2 * this.p;
            proposed.blocks[3][0] += this.p;
            proposed.blocks[3][1] -= this.p;
            proposed.blocks[2][0] -= 2 * this.p;
            proposed.state = 1;
        }

    }

    else if (proposed.colour == "aquamarine") {
        if (proposed.state == 1) {
            proposed.blocks[2][1] -= this.p;
            proposed.blocks[3][0] -= 2 * this.p;
            proposed.blocks[3][1] -= this.p;
            proposed.state = 2;
        }
        else if (proposed.state == 2) {
            proposed.blocks[2][1] += this.p;
            proposed.blocks[3][0] += 2 * this.p;
            proposed.blocks[3][1] += this.p;
            proposed.state = 1;
        }

    }
    else if (proposed.colour == "greenyellow") {
        if (proposed.state == 1) {
            proposed.blocks[2][1] -= 2 * this.p;
            proposed.blocks[3][0] += 2 * this.p;
            proposed.state = 2;
        }
        else if (proposed.state == 2) {
            proposed.blocks[2][1] += 2 * this.p;
            proposed.blocks[3][0] -= 2 * this.p;
            proposed.state = 1;
        }

    }
    else if (proposed.colour == "pink") {
        if (proposed.state == 1) {
            proposed.blocks[3][1] -= 2 * this.p;
            proposed.blocks[3][0] -= 2 * this.p;
            proposed.state = 2;
        }
        else if (proposed.state == 2) {
            proposed.blocks[3][1] += this.p;
            proposed.blocks[3][0] += 2 * this.p;
            proposed.blocks[2][1] += this.p;
            proposed.blocks[2][0] += 2 * this.p;
            proposed.state = 3;
        }
        else if (proposed.state == 3) {
            proposed.blocks[3][1] += this.p;
            proposed.blocks[3][0] -= 3 * this.p;
            proposed.blocks[2][1] += this.p;
            proposed.blocks[2][0] -= 3 * this.p;
            proposed.state = 4;
        }
        else if (proposed.state == 4) {
            proposed.blocks[3][0] += 3 * this.p;
            proposed.blocks[2][0] += this.p;
            proposed.blocks[2][1] -= 2 * this.p;
            proposed.state = 1;
        }

    }
    else if (proposed.colour == "orange") {
        if (proposed.state == 1) {
            proposed.blocks[3][0] += 2 * this.p;
            proposed.blocks[2][1] += 2 * this.p;
            proposed.blocks[2][0] += 2 * this.p;
            proposed.state = 2;
        }
        else if (proposed.state == 2) {
            proposed.blocks[2][1] -= 2 * this.p;
            proposed.blocks[2][0] -= 2 * this.p;
            proposed.blocks[3][1] -= 2 * this.p;
            proposed.state = 3;
        }
        else if (proposed.state == 3) {
            proposed.blocks[2][1] += this.p;
            proposed.blocks[2][0] -= 2 * this.p;
            proposed.blocks[3][1] += this.p;
            proposed.blocks[3][0] -= 2 * this.p;
            proposed.state = 4;
        }
        else if (proposed.state == 4) {
            proposed.blocks[3][1] += this.p;
            proposed.blocks[2][1] -= this.p;
            proposed.blocks[2][0] += 2 * this.p;
            proposed.state = 1;
        }

    }
    for (let i = 0; i < 4; i++) {
        if (this.rightBorder < proposed.blocks[i][0]
            || this.leftBorder > proposed.blocks[i][0]) {
            return;
        }
        
    }

    for (let i = 0; i < this.past.length; i++) {
      for (let j = 0; j < this.past[i].blocks.length; j++) {
          if (this.past[i].blocks[j][0] == proposed.blocks[0][0] && this.past[i].blocks[j][1] == proposed.blocks[0][1]
              || this.past[i].blocks[j][0] == proposed.blocks[1][0] && this.past[i].blocks[j][1] == proposed.blocks[1][1]
              || this.past[i].blocks[j][0] == proposed.blocks[2][0] && this.past[i].blocks[j][1] == proposed.blocks[2][1]
              || this.past[i].blocks[j][0] == proposed.blocks[3][0] && this.past[i].blocks[j][1] == proposed.blocks[3][1]) {
              return;
          }
      }
    }
  this.current = proposed;

  }

}


