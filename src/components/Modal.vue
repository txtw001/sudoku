<template>
  <div class="modal fade" :id="id" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">{{title}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
            @click="$emit('canceled')" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary"
            @click="$emit('canceled')" data-bs-dismiss="modal">{{closeBtnText}}</button>
          <button type="button" class="btn btn-primary"
            @click="$emit('accepted')" data-bs-dismiss="modal">{{actionBtnText}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  emits: ['canceled', 'accepted'],
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      reqired: true,
    },
    closeBtnText: {
      type: String,
      reqired: true,
      default() {
        return 'Cancel';
      },
    },
    actionBtnText: {
      type: String,
      reqired: true,
    },
  },
};
</script>
