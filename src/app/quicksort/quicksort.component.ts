import { Component, OnInit } from '@angular/core';
import { LineComponent } from '../line/line.component';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Algorithm, ArraySize } from '../enums'

@Component({
  selector: 'app-quicksort',
  templateUrl: './quicksort.component.html',
  styleUrls: ['./quicksort.component.css']
})
export class QuicksortComponent implements OnInit {
  lines:LineComponent[] = [];
  faChevronRight = faChevronRight;
  algorithms: Algorithm[] = [Algorithm.mergeSort, Algorithm.selectionSort];
  arraySizes: ArraySize[] = [ArraySize.small, ArraySize.medium, ArraySize.large];
  currentSelection: Algorithm = Algorithm.mergeSort;
  currentArraySize: ArraySize = ArraySize.medium;
  smallNumber:number = 20;
  mediumNumber:number = 40;
  largeNumber:number = 80;
  


  constructor() { }

  ngOnInit(): void {
    let lineNumber:Number;
    let height:number;
    switch(this.currentArraySize){
      
      case ArraySize.small:
        lineNumber = this.smallNumber;
        height = 25;
        break;
      case ArraySize.medium:
        lineNumber = this.mediumNumber;
        height = 10;
        break;
      case ArraySize.large:
        lineNumber = this.largeNumber;
        height = 5;
        break;
    }
    this.lines = [];
    for(let i = 0; i < lineNumber; i++) {
      let line = new LineComponent();
      line.ngOnInit();
      line.value = Math.floor(Math.random() * 100) + 1;
      line.height = height;
      this.lines.push(line);
    }
  }

  selectAlgo(algo: string) {
    this.algorithms.forEach(element => {
      if(element.valueOf() == algo) {
        this.currentSelection = element;
      }
    });
  }

  selectArraySize(size: string) {
    this.arraySizes.forEach(element => {
      if(element.valueOf() == size) {
        this.currentArraySize = element;
      }
    });
    this.ngOnInit();
  }

  sort() {
    switch(this.currentSelection) {
      case Algorithm.mergeSort: {
        this.mergeSort(this.lines);
        break;
      }
      case Algorithm.quickSort: {
        this.quickSort(this.lines);
        break;
      }
      case Algorithm.selectionSort: {
        this.selectionSort(this.lines);
        break;
      }
    }
  }

  displayChevron():boolean{
    if(this.currentSelection == Algorithm.selectionSort){
      return true;
    }
    return false;
  }

  async selectionSort(array: LineComponent[]): Promise<void> {
    let minIndex = 0;
    
    for(let i = 0; i < array.length; i++) {
      if(i > 0) {
        array[i-1].isActive = false;
      }
      
      array[i].isActive = true;
      minIndex = await this.findMinIndex(array, i);
      if(i == array.length - 1) {
        array[i].isActive = false;
      }
      
      let temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
      await this.delay(100);
      temp.isActive = false;
    }
  }

  async findMinIndex(array: LineComponent[], start: number): Promise<number> {
    let minIndex = start;
    array[minIndex].isMinimum = true;
    for(let i = start; i < array.length; i++) {
      array[i].isSecondary = true;
      if(i > 0) {
        array[i-1].isSecondary = false;
      }
      
      await this.delay(40);
      if(i == array.length - 1) {
        array[i].isSecondary = false;
      }
      if(array[i].value < array[minIndex].value) {
        array[minIndex].isMinimum = false;
        array[i].isMinimum = true;
        minIndex = i;
      }
    }
    return minIndex;
  }

  async mergeSort(array: LineComponent[]): Promise<void> {
    // this.mergeSplit(array, 0, array.length - 1);
    for(let runWidth:number = 1; runWidth < array.length; runWidth = 2 * runWidth){
      for(let eachRunStart = 0; eachRunStart < array.length; eachRunStart = eachRunStart + 2 * runWidth){
        let start:number = eachRunStart;
        let mid = eachRunStart + (runWidth - 1);
        if(mid >= array.length){
          mid = array.length -1;
        }
        let end:number = eachRunStart + ((2* runWidth) - 1);
        if(end >= array.length){
          end = array.length -1;
        }
        this.mergeHalves(array, start, mid, end)
        await this.delay(200);
      }
    }
    for(let i:number = 0; i < array.length; i++){
      array[i].isActive = false;
      array[i].isMinimum = true;

    }
  }

  // async mergeSplit(array: LineComponent[], start:number, end:number):Promise<void> {
    
  //   if(start < end){
  //     let middle:number = Math.floor((start + end) / 2);
  //     this.mergeSplit(array, start, middle);
      
  //     this.mergeSplit(array, middle + 1, end);
      
  //     this.mergeHalves(array,start, middle, end);
      
  //   }
    
  // }

  mergeHalves(array: LineComponent[], start:number, mid:number, end:number){
    
    let i:number = start;
    let j:number = mid+1;
    let k:number = 0;
    let temp:number[] = [];

    while(i <= mid && j <= end){
      array[i].isActive = true;
      array[j].isActive = true;
      if(array[i].value <= array[j].value){  
        array[i].isMinimum = true;
        array[i].isActive = false;
        
        temp[k] = array[i].value;
        i++;
        k++
      }
      else {
        array[j].isMinimum = true;
        array[j].isActive = false;
        temp[k] = array[j].value;
        j++;
        k++;
      }
      
    }
    while(i <= mid){
      temp[k] = array[i].value;
      i++;
      k++;
    }
    while(j <= end){
      temp[k] = array[j].value;
      k++;
      j++;
    }

    for(let i:number = start; i <= end; i++){
      array[i].value = temp[i-start];
    }
    
  }
  

  quickSort(array: LineComponent[]): void {
    console.log('do quick sorty things');
  }
  
  delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
