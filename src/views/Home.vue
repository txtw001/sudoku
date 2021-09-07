<template>
  <div class="home">
    <sudoku-table/>
  </div>
</template>

<script>
// @ is an alias to /src
import SudokuTable from '@/components/SudokuTable.vue';

export default {
  name: 'Home',
  components: {
    SudokuTable,
  },
};
</script>
