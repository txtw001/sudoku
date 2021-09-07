<template>
  <div class="dropdown">
    <button class="btn dropdown-toggle btn-outline-primary btn-sm" type="button" id="mselec"
      data-bs-toggle="dropdown" aria-expanded="false">
      <slot></slot>
    </button>
    <ul class="dropdown-menu" aria-labelledby="mselec">
      <li v-for="option of options" :key="option.value">
        <a class="dropdown-item" role="button"
          @click="$emit('update:modelValue', option.value)">{{ option.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  emits: ['update:modelValue'],
  props: {
    options: {
      type: Array,
      reqired: true,
    },
    modelValue: {
      required: true,
    },
  },
  data() {
    return {
      v: 0,
    };
  },
};
</script>
