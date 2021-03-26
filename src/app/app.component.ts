import { Component } from '@angular/core';

export interface Cell {
    row: number,
    col: number
}

export interface UICell extends Cell {
    label: "O" | "X" | "-"
    highLight: boolean
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [`
        section > div > button {color: #efefef;}
        .status {font-size:18px; color: red; font-weight:bold;}
        .highlight-win {color: red !important;}
        .highlight-x {background-color: blue;}
        .highlight-o {background-color: green;}
    `]
})
export class AppComponent {

    // PROPERTIES
    // ===================
    // set the count of cell in line, if reach this count, it will be consided win.
    public winSequenceLength: number = 3;
    // n x n, if cellboardSize = 5, it will generate cellboard whic size of 5 x 5
    public boardSize: number = 5;
    // 0: not-complete, 1: O-win, 2:X-win, 3: O-X draw
    public isComplete: 0 | 1 | 2 | 3 = 0;
    public uiCells!: UICell[][];
    public isOpponent: boolean = false;

    // INITS
    // ===================

    public ngOnInit(): void {
        this.initialCellboard();
    }

    // inits & resets
    public initialCellboard(): void {
        let baseArr = (new Array(this.boardSize * 1)).fill(0).map((item, index) => item + index);
        this.uiCells = Array.from(baseArr).map(row =>
            Array.from(baseArr).map(col => ({ row, col, label: "-", highLight: false })));
        this.isComplete = 0;
    }

    // for loop performance
    public trackByMethod(): number {
        return Math.floor(Math.random() * 10000);
    }

    // GAME FUNCTIONS
    // ===================

    // 1. Entry point from template
    public triggerCell(cell: UICell) {
        if (cell.label != "-")
            return;
        cell.label = this.isOpponent ? "O" : "X";
        this.isOpponent = !this.isOpponent;
        this.evaluateWinner(cell);
    }

    // 2. evaluate result
    private evaluateWinner(cell: UICell) {
        this.check('leftAcross', cell) ||
            this.check('rightAcross', cell) ||
            this.check('horizontal', cell) ||
            this.check('vertical', cell) ||
            this.checkDraw();
    }

    // 2.1 check for winner
    private check(direction: 'leftAcross' | 'rightAcross' | 'horizontal' | 'vertical', trigger: UICell): boolean {

        let playerSequence: Cell[] = [];

        // loop template fn
        let fillSequence = (cell: Cell,
            condition: { (cell: Cell): boolean },
            moveNext: { (cell: Cell): void }) => {
            let result = true;
            while (condition(cell)) {
                let item = this.uiCells[cell.row][cell.col];
                result &&= item.label == trigger.label && item.label !== '-';
                if (!result)
                    break;
                playerSequence.push({ row: cell.row, col: cell.col });
                moveNext(cell);
            }
        };

        // filling playerSequence
        switch (direction) {
            case 'leftAcross':
                fillSequence({ row: trigger.row, col: trigger.col }, (c) => (c.row >= 0 && c.col >= 0), (c) => c.row-- && c.col--);
                fillSequence({ row: trigger.row + 1, col: trigger.col + 1 }, (c) => (c.row < this.uiCells.length && c.col < this.uiCells.length), (c) => c.row++ && c.col++);
                break;
            case 'rightAcross':
                fillSequence({ row: trigger.row, col: trigger.col }, (c) => (c.row >= 0 && c.col < this.uiCells.length), (c) => c.row-- && c.col++);
                fillSequence({ row: trigger.row + 1, col: trigger.col - 1 }, (c) => (c.row < this.uiCells.length && c.col >= 0), (c) => c.row++ && c.col--);
                break;
            case 'horizontal':
                fillSequence({ row: trigger.row, col: trigger.col }, (c) => (c.row >= 0), (c) => c.row--);
                fillSequence({ row: trigger.row + 1, col: trigger.col }, (c) => (c.row < this.uiCells.length), (c) => c.row++);
                break;
            case 'vertical':
                fillSequence({ row: trigger.row, col: trigger.col }, (c) => (c.col >= 0), (c) => c.col--);
                fillSequence({ row: trigger.row, col: trigger.col + 1 }, (c) => (c.col < this.uiCells.length), (c) => c.col++);
                break;
        }

        // win condition
        if (playerSequence.length >= this.winSequenceLength) {
            this.isComplete = trigger.label == "X" ? 2 : 1;
            playerSequence.map((item, index) => {
                if (index < this.winSequenceLength)
                    this.uiCells[item.row][item.col].highLight = true;
            });
            return true;
        }
        return false;
    }

    // 2.2 check for draw
    private checkDraw(): boolean {
        for (let i = 0; i < this.uiCells.length; i++) {
            for (let j = 0; j < this.uiCells[i].length; j++) {
                if (this.uiCells[i][j].label == "-")
                    return false;
            }
        }
        this.isComplete = 3;
        return true;
    }


    //  ======================== original evaluation methods ========================

    topLeftMiddleBottomRight(cell: UICell) {
        let result: boolean = true;
        let selectedItems: Cell[] = [];
        let { row, col }: Cell = { row: cell.row, col: cell.col };
        while (row >= 0 && col >= 0) {
            let item = this.uiCells[row][col];
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
        while (row < this.uiCells.length && col < this.uiCells.length) {
            let item = this.uiCells[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row++;
            col++;
        }

        if (selectedItems.length >= this.winSequenceLength) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.winSequenceLength)
                    this.uiCells[item.row][item.col].highLight = true;
            });
        }
        return selectedItems;
    }

    topMiddleBottom(cell: UICell) {
        let result: boolean = true;
        let selectedItems: Cell[] = [];
        let { row, col }: Cell = { row: cell.row, col: cell.col };
        while (row >= 0 && col < this.uiCells.length) {
            let item = this.uiCells[row][col];
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
        while (row < this.uiCells.length && col >= 0) {
            let item = this.uiCells[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row++;
            col--;
        }

        if (selectedItems.length >= this.winSequenceLength) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.winSequenceLength)
                    this.uiCells[item.row][item.col].highLight = true;
            });
        }
        return selectedItems;
    }

    topRightMiddleBottomLeft(cell: UICell) {
        let result: boolean = true;
        let selectedItems: Cell[] = [];
        let { row, col }: Cell = { row: cell.row, col: cell.col };
        while (row >= 0) {
            let item = this.uiCells[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row--;
        }
        row = cell.row + 1;
        result = true
        while (row < this.uiCells.length) {
            let item = this.uiCells[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            row++;
        }

        if (selectedItems.length >= this.winSequenceLength) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.winSequenceLength)
                    this.uiCells[item.row][item.col].highLight = true;
            });
        }
        return selectedItems;
    }

    leftMiddleRight(cell: UICell) {
        let result: boolean = true;
        let selectedItems: Cell[] = [];
        let { row, col }: Cell = { row: cell.row, col: cell.col };
        while (col >= 0) {
            let item = this.uiCells[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            col--;
        }
        col = cell.col + 1;
        result = true
        while (col < this.uiCells.length) {
            let item = this.uiCells[row][col];
            result &&= item.label == cell.label && item.label !== '-';
            if (!result)
                break;
            selectedItems.push({ row, col });
            col++;
        }

        if (selectedItems.length >= this.winSequenceLength) {
            this.isComplete = cell.label == "X" ? 2 : 1;
            selectedItems.map((item, index) => {
                if (index < this.winSequenceLength)
                    this.uiCells[item.row][item.col].highLight = true;
            });
        }
        return selectedItems;
    }
}