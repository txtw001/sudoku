<template>
  <nav id="nav" class="navbar navbar-expand-lg navbar-light mb-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"
      style="color:#01579B; font-size:1.5rem; margin-bottom:0.2rem;">Sudoku</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'home'}" class="nav-link"
              :class="{active:routeName === 'home'}">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about'}" class="nav-link"
              :class="{active:routeName === 'about'}">About</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'tips'}" class="nav-link"
              :class="{active:routeName === 'tips'}">Tips & Tricks</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view/>
</template>

<script>
// eslint-disable-next-line no-unused-vars

export default {
  data() {
    return {
      routeName: '',
    };
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
  },
};

</script>

<style lang="scss">

@import "@/scss/bootstrap_custom";
@import "@/scss/global";

#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #263238;

  h1 {
    font-size: 2.5em;
  }
}

#nav {
  background-color: #E3F2FD;

  .nav-link {
    font-weight: 700;
    color: #01579B;
  }
  .active {
      color: #1976D2;
    }
}
</style>
