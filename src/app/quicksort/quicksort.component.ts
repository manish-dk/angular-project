import { Component, OnInit } from "@angular/core";
import { LineComponent } from "../line/line.component";
import { Algorithm, ArraySize, Order } from "../enums";

@Component({
  selector: "app-quicksort",
  templateUrl: "./quicksort.component.html",
  styleUrls: ["./quicksort.component.css"],
})
export class QuicksortComponent implements OnInit {
  lines: LineComponent[] = [];
  algorithms: Algorithm[] = [
    Algorithm.mergeSort,
    Algorithm.selectionSort,
    Algorithm.cocktailSort,
  ];
  arraySizes: ArraySize[] = [
    ArraySize.small,
    ArraySize.medium,
    ArraySize.large,
  ];
  orders: Order[] = [Order.ascending, Order.descending];
  currentOrder: Order = Order.ascending;
  currentAlgorithm: Algorithm = Algorithm.mergeSort;
  currentArraySize: ArraySize = ArraySize.medium;
  smallNumber: number = 40;
  mediumNumber: number = 80;
  largeNumber: number = 160;
  multiplier: number = this.currentOrder == Order.ascending ? 1 : -1;
  hover: boolean;

  constructor() {}

  ngOnInit(): void {
    let lineNumber: Number;
    let height: number;
    switch (this.currentArraySize) {
      case ArraySize.small:
        lineNumber = this.smallNumber;
        height = 10;
        break;
      case ArraySize.medium:
        lineNumber = this.mediumNumber;
        height = 5;
        break;
      case ArraySize.large:
        lineNumber = this.largeNumber;
        height = 2;
        break;
    }
    this.lines = [];
    for (let i = 0; i < lineNumber; i++) {
      let line = new LineComponent();
      line.ngOnInit();
      line.value = Math.floor(Math.random() * 100) + 1;
      line.height = height;
      this.lines.push(line);
    }
  }

  selectAlgo(algo: string) {
    this.algorithms.forEach((element) => {
      if (element.valueOf() == algo) {
        this.currentAlgorithm = element;
      }
    });
  }

  selectOrder(order: string) {
    this.orders.forEach((element) => {
      if (element.valueOf() == order) {
        this.currentOrder = element;
      }
    });
    this.multiplier = this.currentOrder == Order.ascending ? 1 : -1;
  }

  selectArraySize(size: string) {
    this.arraySizes.forEach((element) => {
      if (element.valueOf() == size) {
        this.currentArraySize = element;
      }
    });
    this.ngOnInit();
  }

  sort() {
    switch (this.currentAlgorithm) {
      case Algorithm.mergeSort: {
        this.mergeSort(this.lines);
        break;
      }
      case Algorithm.cocktailSort: {
        this.cocktailSort(this.lines);
        break;
      }
      case Algorithm.selectionSort: {
        this.selectionSort(this.lines);
        break;
      }
    }
  }

  displayChevron(): boolean {
    if (this.currentAlgorithm == Algorithm.selectionSort) {
      return true;
    }
    return false;
  }

  async selectionSort(array: LineComponent[]): Promise<void> {
    let minIndex = 0;

    for (let i = 0; i < array.length; i++) {
      if (i > 0) {
        array[i - 1].isActive = false;
      }

      array[i].isActive = true;
      minIndex = await this.findMinIndex(array, i);
      if (i == array.length - 1) {
        array[i].isActive = false;
      }

      let temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
      await this.delay(1000 / this.currentArraySize.length);
      temp.isActive = false;
    }
  }

  async findMinIndex(array: LineComponent[], start: number): Promise<number> {
    let minIndex = start;
    array[minIndex].isMinimum = true;
    for (let i = start; i < array.length; i++) {
      array[i].isSecondary = true;
      if (i > 0) {
        array[i - 1].isSecondary = false;
      }

      await this.delay(80 / this.currentArraySize.length);
      if (i == array.length - 1) {
        array[i].isSecondary = false;
      }
      if (
        array[i].value * this.multiplier <
        array[minIndex].value * this.multiplier
      ) {
        array[minIndex].isMinimum = false;
        array[i].isMinimum = true;
        minIndex = i;
      }
    }
    return minIndex;
  }

  async mergeSort(array: LineComponent[]): Promise<void> {
    // this.mergeSplit(array, 0, array.length - 1);
    for (
      let runWidth: number = 1;
      runWidth < array.length;
      runWidth = 2 * runWidth
    ) {
      for (
        let eachRunStart = 0;
        eachRunStart < array.length;
        eachRunStart = eachRunStart + 2 * runWidth
      ) {
        let start: number = eachRunStart;
        let mid = eachRunStart + (runWidth - 1);
        if (mid >= array.length) {
          mid = array.length - 1;
        }
        let end: number = eachRunStart + (2 * runWidth - 1);
        if (end >= array.length) {
          end = array.length - 1;
        }
        this.mergeHalves(array, start, mid, end);
        await this.delay(200);
      }
    }
    for (let i: number = 0; i < array.length; i++) {
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

  async mergeHalves(
    array: LineComponent[],
    start: number,
    mid: number,
    end: number
  ) {
    let i: number = start;
    let j: number = mid + 1;
    let k: number = 0;
    let temp: number[] = [];

    while (i <= mid && j <= end) {
      array[i].isActive = true;
      array[j].isActive = true;
      if (
        array[i].value * this.multiplier <=
        array[j].value * this.multiplier
      ) {
        array[i].isMinimum = true;
        array[i].isActive = false;

        temp[k] = array[i].value;
        i++;
        k++;
      } else {
        array[j].isMinimum = true;
        array[j].isActive = false;
        temp[k] = array[j].value;
        j++;
        k++;
      }
    }
    while (i <= mid) {
      temp[k] = array[i].value;
      i++;
      k++;
    }
    while (j <= end) {
      temp[k] = array[j].value;
      k++;
      j++;
    }

    for (let i: number = start; i <= end; i++) {
      array[i].value = temp[i - start];
    }
  }

  async cocktailSort(array: LineComponent[]): Promise<void> {
    let swapped: boolean = false;
    let start: number = 0;
    let end: number = array.length - 2;
    do {
      for (let i: number = start; i < end; i++) {
        array[i].isActive = true;
        await this.delay(80 / this.currentArraySize.length);
        // array[i].isMinimum = true;
        if (
          array[i].value * this.multiplier >
          array[i + 1].value * this.multiplier
        ) {
          // array[i].isMinimum = false;

          let temp: number = array[i].value;
          array[i].value = array[i + 1].value;
          array[i + 1].value = temp;
          swapped = true;
          // array[i].isMinimum = true;
        }
        array[i].isActive = false;
        array[i].isMinimum = true;
      }

      if ((swapped = false)) {
        break;
      }
      swapped = false;
      for (let i: number = end; i >= start; i--) {
        array[i + 1].isActive = true;
        await this.delay(80 / this.currentArraySize.length);

        if (
          array[i].value * this.multiplier >
          array[i + 1].value * this.multiplier
        ) {
          // array[i].isMinimum = false;

          let temp: number = array[i].value;
          array[i].value = array[i + 1].value;
          array[i + 1].value = temp;
          swapped = true;
          // array[i + 1].isMinimum = true;
        }
        array[i].isActive = false;
        array[i].isMinimum = true;
      }
      start += 1;
      end -= 1;
    } while (swapped);
    for (let i: number = 0; i < array.length; i++) {
      await this.delay(80 / this.currentArraySize.length);
      array[i].isActive = false;
      array[i].isMinimum = true;
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
