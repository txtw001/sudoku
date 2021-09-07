<template>
  <slot></slot>
</template>

<script>
// @ is an alias to /src

export default {
  mounted() {
    this.offset = this.offsetIn;
    document.addEventListener('visibilityChange', this.visibilityChanged);
  },
  beforeUnmount() {
    document.removeEventListener('visibilityChange', this.visibilityChanged);
  },
  emits: ['update:running', 'update:elapsed'],
  props: {
    running: {
      type: Boolean,
      required: true,
    },
    elapsed: {
      type: Object,
      required: true,
    },
    offsetIn: {
      default() {
        return 0;
      },
    },
    refreshTimeout: {
      default() {
        return 500;
      },
    },
  },
  watch: {
    running(newVal, old) {
      if (newVal !== old) {
        if (newVal) this.start();
        else this.pause();
      }
    },
  },
  data() {
    return {
      startPoint: null,
      offset: 0,
      timerToken: null,
    };
  },
  computed: {

  },
  methods: {
    start() {
      this.startPoint = new Date();
      this.setUpdate();
    },
    pause() {
      this.offset = this.timems();
      this.startPoint = null;
      this.clearUpdate();
    },
    setOffset(offset) {
      this.offset = offset;
    },
    reset(offset) {
      this.pause();
      this.offset = offset || 0;
      this.$emit('update:running', false);
      this.$emit('update:elapsed', this.time());
    },
    setUpdate() {
      if (this.timerToken) {
        throw new Error('Timer update already set.');
      }
      this.timerToken = setInterval(() => {
        this.$emit('update:elapsed', this.time());
      }, this.refreshTimeout);
    },
    clearUpdate() {
      if (this.timerToken) {
        clearInterval(this.timerToken);
        this.timerToken = null;
      }
    },
    visibilityChanged() {
      if (this.startPoint) {
        if (document.hidden) {
          this.clearUpdate();
        } else {
          this.setUpdate();
        }
      }
    },
    timems() {
      if (this.startPoint) {
        const actual = new Date();
        return actual.getTime() - this.startPoint.getTime() + this.offset;
      }
      return this.offset;
    },
    time() {
      let elapsed = this.timems();
      const h = Math.floor(elapsed / (1000 * 3600));
      elapsed %= (1000 * 3600);
      const m = Math.floor(elapsed / (1000 * 60));
      elapsed %= (1000 * 60);
      const s = Math.floor(elapsed / 1000);

      return { h, m, s };
    },
  },
};
</script>
