<template>
  <section>
    <div class="container-xxl">
      <div class="row vert-controls">
        <div class="col-md-6 mb-2">
          <div class="d-flex justify-content-between align-items-center">
            <multi-select-dropdown
              :modelValue="control.difficulty"
              @update:modelValue="newDifficultySelected($event)"
              :options="control.difficulty.options">
              <strong>{{difficultyToString(control.difficulty.actual)}}</strong>
            </multi-select-dropdown>
            <div class="form-check form-switch">
              <label class="form-check-label" for="sw1">Auto-validate</label>
              <input class="form-check-input" v-model="control.autoValidate"
                type="checkbox" id="sw1" checked>
            </div>
            <timer v-model:running="control.timer.running"
              v-model:elapsed="control.timer.elapsed" ref="timer">
              <div class="d-flex align-items-center">
                <div class="me-2">
                  <svg v-show="control.timer.running" role="button" @click="control.timer.running = false" xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"/>
                  </svg>
                  <svg v-show="!control.timer.running" role="button" @click="control.timer.running = true" xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                  </svg>
                </div>
                <span>{{timeString}}</span>
              </div>
            </timer>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <div v-if="!sudoku.ready" class="h-100">
            <div class="d-flex justify-content-center align-items-center h-100">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div v-else class="square-container">
            <div v-for="(cell, i) of sudoku.actual" :key="i" class="square noselect" role="button"
              :class="['r'+indexX(i), 'c'+indexY(i)]"
              :style="cellStyles[indexX(i)][indexY(i)]"
              @click="cellClick(indexX(i), indexY(i))">
              <div class="content" >
                <span v-if="cell">{{cell}}</span>
              </div>
            </div>
            <div v-if="!control.timer.running"
              class="d-flex justify-content-center align-items-center overlay">
              <svg xmlns="http://www.w3.org/2000/svg" role="button" @click="control.timer.running = true" width="3.5em" height="3.5em" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="row g-1">
            <div v-for="j of [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="j" class="col-md-4 col-2">
              <div class="b-s" role="button" @click="setNumber(j)">
                <span class="btn-content">{{ j }}</span>
              </div>
            </div>
          </div>
          <div class="row g-1 mt-3">
            <div class="col-md-4 col-2">
              <div class="b-s" role="button" @click="setNumber(0)">
                <div class="btn-content">
                  <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-2">
              <div class="b-s" role="button" @click="restart()">
                <div class="btn-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-2">
              <div class="b-s" role="button" @click="placeNumber()">
                <div class="btn-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" fill="currentColor" class="bi bi-pin-map" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"/><path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <bs-modal :id="'newGameModal'" :title="'New game'" :actionBtnText="'Continue'"
    @accepted="newDifficultyAccepted()" @canceled="newDifficultyRejected()">
    <p> Would you like to start a new game on
      <strong>{{difficultyToString(control.difficulty.new)}}</strong> difficulty?
    </p>
    <strong>The current game will be lost!</strong>
  </bs-modal>

  <bs-modal :id="'loadGameModal'" :title="'Load game'" :actionBtnText="'Load'"
    @accepted="loadGame()" @canceled="generateGame()">
    <p>Would you like to continue your previous game?</p>
  </bs-modal>

  <bs-modal :id="'wonModal'" :title="'Congratulations'" :actionBtnText="'New Game'"
    @accepted="newDifficultyAccepted()" @canceled="newDifficultyRejected()">
    <p>You have completed the game in {{timeString}}.</p>
    <p>Start a new game on a different difficulty.</p>
      <div class="d-flex">
        <div class="btn-group" role="group" aria-label="Difficulty selector">
          <button v-for="diff of control.difficulty.options" :key="diff.id"
            @click="control.difficulty.new = diff.value;"
            type="button" class="btn"
            :class="[control.difficulty.new === diff.value ? 'btn-primary' : 'btn-secondary']">
              {{ diff.name }}
          </button>
        </div>
      </div>
  </bs-modal>
</template>

<script>

import { Modal } from 'bootstrap';
import MultiSelectDropdown from './MultiSelectDropdown.vue';
import BsModal from './Modal.vue';
import Timer from './Timer.vue';
import LocalStorage from '../db/LocalStorage';
import Generator from '../logic/generator';
import Utils from '../logic/utils';

export default {
  name: 'SudokuTable',

  mounted() {
    this.modals.newGame = new Modal(document.getElementById('newGameModal'), {});
    this.modals.loadGame = new Modal(document.getElementById('loadGameModal'), {});
    this.modals.wonGame = new Modal(document.getElementById('wonModal'), {});

    window.addEventListener('beforeunload', this.saveGame);

    if (this.hasSavedGame()) {
      this.modals.loadGame.show();
    } else {
      this.newTable(this.control.difficulty.actual);
    }
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.saveGame);
    this.saveGame();
  },
  components: {
    MultiSelectDropdown,
    BsModal,
    Timer,
  },
  watch: {
    'control.autoValidate': function (newVal) {
      if (newVal) {
        this.autoValidate();
      }
    },
  },
  data() {
    const data = {
      styles: {
        defaultFont: 'Archivo',
        userFont: 'Tillana',
        baseBgColor: '#fff',
        color: '#37474F',
        selBgColor: '#E3F2FD',
        selCellBgColor: '#90CAF9',
        errorBgColor: '#F8BBD0',
        errorSelBgColor: '#f384a9',
        fontNormal: '300',
        fontBold: '500',
        userFontNormal: '400',
        userFontBold: '600',
        userColor: '#01579B',
      },
      constants: {
        size: 9,
        size_sq: 0, // calculated
        sqrt_size: 0, // calculated
      },
      sudoku: {
        actual: null,
        initial: null,
        generated: null,
        solution: null,
        selectedCell: { x: -1, y: -1 },
        ready: false,
      },
      control: {
        difficulty: {
          options: [
            {
              value: 0,
              name: 'Easy',
            },
            {
              value: 1,
              name: 'Medium',
            },
            {
              value: 2,
              name: 'Hard',
            },
            {
              value: 3,
              name: 'Ultra',
            },
          ],
          actual: 0,
          new: 0,
        },
        autoValidate: true,
        timer: {
          running: false,
          elapsed: { h: 0, m: 0, s: 0 },
        },
      },
      storage: new LocalStorage(),
      modals: {
      },
      cellStyles: null,
    };

    data.constants.size_sq = data.size * data.size;
    data.constants.sqrt_size = Math.round(Math.sqrt(data.size));

    // generate default styles
    const length = data.constants.size;
    data.styles.defaultStyle = {
      backgroundColor: data.styles.baseBgColor,
      fontWeight: data.styles.fontNormal,
      fontFamily: data.styles.defaultFont,
      color: data.styles.color,
    };
    data.cellStyles = Array.from({ length },
      () => Array.from({ length }, () => (data.styles.defaultStyle)));

    return data;
  },
  computed: {
    timeString() {
      const t = this.control.timer.elapsed;
      const short = `${t.m.toString().padStart(2, '0')}:${t.s.toString().padStart(2, '0')}`;
      if (t.h > 0) {
        return `${t.h.toString().padStart(2, '0')}:${short}`;
      }
      return short;
    },
  },
  methods: {
    generateGame() {
      this.newTable(this.control.difficulty.actual);
      this.removeSavedGame();
    },
    saveGame() {
      if (this.sudoku.ready && !Utils.arrayCompare(this.sudoku.actual, this.sudoku.generated)) {
        const saved = {
          generated: this.sudoku.generated,
          initial: this.sudoku.initial,
          actual: this.sudoku.actual,
          solution: this.sudoku.solution,
          difficulty: this.control.difficulty.actual,
          timerOffset: this.$refs.timer.timems(),
        };
        this.storage.save('sudoku_save_game', saved);
        this.storage.save('sudoku_save_time', new Date().getTime().toString());
      }
    },
    loadGame() {
      const loaded = this.storage.read('sudoku_save_game');
      if (loaded) {
        this.sudoku.generated = loaded.generated;
        this.sudoku.initial = loaded.initial;
        this.sudoku.actual = loaded.actual;
        this.sudoku.solution = loaded.solution;
        this.control.difficulty.actual = loaded.difficulty;
        this.control.difficulty.new = loaded.difficulty;
        this.$refs.timer.reset(loaded.timerOffset);
        this.initTable();
        this.removeSavedGame();
        return true;
      }
      return false;
    },
    removeSavedGame() {
      this.storage.delete('sudoku_save_game');
      this.storage.delete('sudoku_save_time');
    },
    hasSavedGame() {
      return this.storage.read('sudoku_save_time') !== null;
    },
    restart() {
      this.modals.newGame.show();
    },
    difficultyToString(difficulty) {
      return this.control.difficulty.options.find((i) => i.value === difficulty).name;
    },
    newDifficultySelected(val) {
      if (this.control.difficulty.new !== val) {
        this.control.difficulty.new = val;
        this.modals.newGame.show();
      }
    },
    newDifficultyAccepted() {
      this.control.difficulty.actual = this.control.difficulty.new;
      this.newTable(this.control.difficulty.actual);
    },
    newDifficultyRejected() {
      this.control.difficulty.new = this.control.difficulty.actual;
    },
    placeNumber() {
      if (!this.isSelectionValid() || !this.control.timer.running) {
        return;
      }
      const i = this.sudoku.selectedCell.x;
      const j = this.sudoku.selectedCell.y;
      const value = this.sudoku.solution[i * this.constants.size + j];
      this.sudoku.actual[i * this.constants.size + j] = value;
      this.sudoku.generated[i * this.constants.size + j] = value;
      this.cellStyles[i][j] = { ...this.styles.defaultStyle };
      // Apply styles
      this.highlight(i, j);
      this.autoValidate();
    },
    initTable() {
      this.initStyles();
      this.sudoku.selectedCell.x = -1;
      this.sudoku.selectedCell.y = -1;
      this.autoValidate();
      this.sudoku.ready = true;
    },
    newTable(diff) {
      Generator.generateShudoku(diff)
        .then((data) => {
          this.sudoku.initial = [...data.generated];
          this.sudoku.generated = [...data.generated];
          this.sudoku.actual = [...data.generated];
          this.sudoku.solution = [...data.solved];
          this.initTable();
          this.$refs.timer.reset();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setNumber(value) {
      if (!this.isSelectionValid() || !this.control.timer.running) {
        return;
      }
      const i = this.sudoku.selectedCell.x;
      const j = this.sudoku.selectedCell.y;
      if (this.sudoku.generated[i * this.constants.size + j] !== 0) {
        return;
      }
      this.sudoku.actual[i * this.constants.size + j] = value;
      this.userInputStyle(i, j);
      this.highlight(i, j);
      this.autoValidate();
      this.isComplete();
    },
    autoValidate() {
      if (this.control.autoValidate) {
        this.validate();
      }
    },
    validate() {
      let valid = true;
      const ii = this.sudoku.selectedCell.x;
      const jj = this.sudoku.selectedCell.y;
      for (let i = 0; i < this.constants.size; i++) {
        for (let j = 0; j < this.constants.size; j++) {
          if (!this.isZeroOrValid(i, j)) {
            if (i === ii && j === jj) {
              this.cellStyles[i][j].backgroundColor = this.styles.errorSelBgColor;
            } else {
              this.cellStyles[i][j].backgroundColor = this.styles.errorBgColor;
            }

            valid = false;
          }
        }
      }
      return valid;
    },
    isValid(i, j) {
      const idx = i * this.constants.size + j;
      return this.sudoku.actual[idx] === this.sudoku.solution[idx];
    },
    isZeroOrValid(i, j) {
      const idx = i * this.constants.size + j;
      return this.sudoku.actual[idx] === 0 || this.sudoku.actual[idx] === this.sudoku.solution[idx];
    },
    isComplete() {
      if (this.sudoku.ready && Utils.arrayCompare(this.sudoku.actual, this.sudoku.solution)) {
        this.control.timer.running = false;
        this.modals.wonGame.show();
      }
    },
    cellClick(i, j) {
      this.sudoku.selectedCell.x = i;
      this.sudoku.selectedCell.y = j;
      this.highlight(i, j);
      this.autoValidate();
    },
    isSelectionValid() {
      return this.sudoku.selectedCell.x >= 0 && this.sudoku.selectedCell.x < this.constants.size
        && this.sudoku.selectedCell.y >= 0 && this.sudoku.selectedCell.y < this.constants.size;
    },
    initStyles() {
      for (let i = 0; i < this.constants.size; i++) {
        for (let j = 0; j < this.constants.size; j++) {
          this.cellStyles[i][j] = { ...this.styles.defaultStyle };
          this.userInputStyle(i, j);
        }
      }
    },
    userInputStyle(i, j) {
      if (this.sudoku.generated[i * this.constants.size + j] === 0) {
        this.cellStyles[i][j].fontFamily = this.styles.userFont;
        this.cellStyles[i][j].color = this.styles.userColor;
      }
    },
    highlight(i, j) {
      this.clearHighlight();
      if (i >= 0 && j >= 0) {
        this.highlightRow(i, this.styles.selBgColor);
        this.highlightColumn(j, this.styles.selBgColor);
        this.highlightSquare(i, j, this.styles.selBgColor);
        this.highlightNumbers(this.sudoku.actual[i * this.constants.size + j]);
        this.highlightCell(i, j, this.styles.selCellBgColor);
      }
    },
    clearHighlight() {
      for (let i = 0; i < this.constants.size; i++) {
        for (let j = 0; j < this.constants.size; j++) {
          this.cellStyles[i][j].backgroundColor = this.styles.baseBgColor;
        }
      }
    },
    highlightNumbers(val) {
      for (let i = 0; i < this.constants.size; i++) {
        for (let j = 0; j < this.constants.size; j++) {
          if (val !== 0 && this.sudoku.actual[i * this.constants.size + j] === val) {
            // eslint-disable-next-line max-len
            this.cellStyles[i][j].fontWeight = this.sudoku.generated[i * this.constants.size + j] !== 0
              ? this.styles.fontBold
              : this.styles.userFontBold;
            this.cellStyles[i][j].backgroundColor = '#FFF8E1';
          } else {
            // eslint-disable-next-line max-len
            this.cellStyles[i][j].fontWeight = this.sudoku.generated[i * this.constants.size + j] !== 0
              ? this.styles.fontNormal
              : this.styles.userFontNormal;
          }
        }
      }
    },
    highlightCell(i, j, col) {
      this.cellStyles[i][j].backgroundColor = col;
    },
    highlightRow(i, col) {
      for (let j = 0; j < this.constants.size; j++) {
        this.cellStyles[i][j].backgroundColor = col;
      }
    },
    highlightColumn(j, col) {
      for (let i = 0; i < this.constants.size; i++) {
        this.cellStyles[i][j].backgroundColor = col;
      }
    },
    highlightSquare(ii, jj, col) {
      const si = Math.floor(ii / 3) * 3;
      const sj = Math.floor(jj / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          this.cellStyles[si + i][sj + j].backgroundColor = col;
        }
      }
    },
    indexX(k) {
      return Math.floor(k / this.constants.size);
    },
    indexY(k) {
      return k % this.constants.size;
    },
    getIndexes(k) {
      return { i: this.indexX(k), j: this.indexY(k) };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

$border-base: 1px solid #aaa;
$border-bold: 3px solid #212121;

.square-container, .btn-container {
  position:relative;
  display: flex;
  flex-wrap: wrap;
}

.square {
  position: relative;
  flex-basis: calc(11.11111%);

  border-top: $border-base;
  border-left: $border-base;
  box-sizing: border-box;
}
.c0,.c3, .c6 {
  border-left: $border-bold;
}
.c8 {
  border-right: $border-bold;
}
.r0,.r3, .r6 {
  border-top: $border-bold;
}
.r8 {
  border-bottom: $border-bold;
}

.btn-square {
  position: relative;
  flex-basis: calc(33.3333%);
  max-width:60px;

  background-color: #42A5F5;
  box-sizing: border-box;
}

.square::before, .btn-square:before {
  content: '';
  display: block;
  padding-top: 100%;
}

.b-s {
  position: relative;
  background-color: #039BE5;
  color: #fff;
  border-radius: 0.4em;
  font-size: 2.2em;
  font-family: 'Tillana', cursive;
  font-weight: 400;
}
.b-s:hover {
  background-color: #42A5F5;
}
.b-s:before {
  content: '';
  display: block;
  padding-top: 100%;
}

.square .content, .btn-content, .overlay {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background-color: rgba(144, 202, 249, 0.6);
  color: #546E7A;
}
.bi-play-circle-fill:hover {
  color: #455A64;
}
.vert-controls {
  font-weight: 700;
}
</style>
