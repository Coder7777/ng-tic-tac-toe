import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [`
        .status {font-size:18px; color: red; font-weight:bold;}
        section > div > button {color: #efefef;}
        .highlight-win {color: red !important;}
        .highlight-x {background-color: blue;}
        .highlight-o {background-color: green;}
    `]
})

export class AppComponent {

    // set the count of chess in line, if reach this count, it will be consided win.
    chessCountInLine: number = 3;
    // n x n, if chessboardSize = 5, it will generate chessboard whic size of 5 x 5
    chessboardSize: number = 5;
    // 0: not-complete, 1: O-win, 2:X-win, 3: O-X draw
    isComplete: 0 | 1 | 2 | 3 = 0;
    chessItems!: ChessItem[][];
    isOpponent: boolean = false;

    constructor() {
    }

    initialChessboard() {
        let baseArr = (new Array(this.chessboardSize * 1)).fill(0).map((item, index) => item + index);
        this.chessItems = Array.from(baseArr).map(row =>
            Array.from(baseArr).map(col => ({ row, col, label: "-", highLight: false })));
        this.isComplete = 0;
    }

    ngOnInit(): void {
        this.initialChessboard();
    }

    trackByMethod(): number {
        return Math.floor(Math.random() * 10000);
    }

    placeChessItem(cell: ChessItem) {
        if (cell.label != "-")
            return;
        cell.label = this.isOpponent ? "O" : "X";
        this.isOpponent = !this.isOpponent;
        this.checkResult(cell);
        this.checkBoard();
    }

    checkBoard() {
        for (let i = 0; i < this.chessItems.length; i++) {
            for (let j = 0; j < this.chessItems[i].length; j++) {
                if (this.chessItems[i][j].label == "-")
                    return;
            }
        }
        this.isComplete = 3;
    }

    checkResult(cell: ChessItem) {
        this.topLeftMiddleBottomRight(cell);
        this.topRightMiddleBottomLeft(cell);
        this.topMiddleBottom(cell);
        this.leftMiddleRight(cell);

    }


    topLeftMiddleBottomRight(cell: ChessItem) {
        let result: boolean = true;
        let selectedItems: selectedItemIndex[] = [];
        let { row, col }: selectedItemIndex = { row: cell.row, col: cell.col };
        while (row >= 0 && col >= 0) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row--;
            col--;

        }
        row = cell.row + 1;
        col = cell.col + 1;
        result = true
        while (row < this.chessItems.length && col < this.chessItems.length) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row++;
            col++;
        }

        if (selectedItems.length >= this.chessCountInLine) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.chessCountInLine)
                    this.chessItems[item.row][item.col].highLight = true;
            });
        }
        return result;
    }

    topMiddleBottom(cell: ChessItem) {
        let result: boolean = true;
        let selectedItems: selectedItemIndex[] = [];
        let { row, col }: selectedItemIndex = { row: cell.row, col: cell.col };
        while (row >= 0) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row--;
        }
        row = cell.row + 1;
        result = true
        while (row < this.chessItems.length) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row++;
        }

        if (selectedItems.length >= this.chessCountInLine) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.chessCountInLine)
                    this.chessItems[item.row][item.col].highLight = true;
            });
        }
        return result;
    }

    topRightMiddleBottomLeft(cell: ChessItem) {
        let result: boolean = true;
        let selectedItems: selectedItemIndex[] = [];
        let { row, col }: selectedItemIndex = { row: cell.row, col: cell.col };
        while (row >= 0 && col < this.chessItems.length) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row--;
            col++;

        }
        row = cell.row + 1;
        col = cell.col - 1;
        result = true
        while (row < this.chessItems.length && col >= 0) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row++;
            col--;
        }

        if (selectedItems.length >= this.chessCountInLine) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.chessCountInLine)
                    this.chessItems[item.row][item.col].highLight = true;
            });
        }
        return result;
    }

    leftMiddleRight(cell: ChessItem) {
        let result: boolean = true;
        let selectedItems: selectedItemIndex[] = [];
        let { row, col }: selectedItemIndex = { row: cell.row, col: cell.col };
        while (col >= 0) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            col--;
        }
        col = cell.col + 1;
        result = true
        while (col < this.chessItems.length) {
            let item = this.chessItems[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            col++;
        }

        if (selectedItems.length >= this.chessCountInLine) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.chessCountInLine)
                    this.chessItems[item.row][item.col].highLight = true;
            });
        }
        return result;
    }
}

export interface ChessItem {
    row: number,
    col: number,
    label: "O" | "X" | "-"
    highLight: boolean
}

export interface selectedItemIndex {
    row: number,
    col: number
}