<template>
  <nav class="d-flex-center position-relative">
    <Paginate
      v-model="page"
      :page-count="totalPage"
      :click-handler="clickCallback"
      :prev-text="$t(`Prev`)"
      :next-text="$t(`Next`)"
      container-class="pagination"
      page-class="page-item"
      page-link-class="page-link"
      prev-link-class="page-link"
      next-link-class="page-link"
      disabled-class="page-item disabled"
    />
    <div class="total-page-info text-right">
      {{ value }}item/{{ totalPage }}item
    </div>
  </nav>
</template>

<script>
// import Paginate from 'vuejs-paginate'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
  components: {
    Paginate,
  },
  props: {
    totalPage: {
      type: Number,
      required: true,
    },
    changePage: {
      type: Function,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      innerValue: 1,
    }
  },
  computed: {
    page: {
      get: function () {
        return Number(this.value) || this.innerValue
      },
      set: function (newValue) {
        this.innerValue = newValue
      },
    },
  },
  methods: {
    clickCallback(pageNum) {
      this.changePage(pageNum)
    },
  },
}
</script>
<style scoped>
.total-page-info {
  position: absolute;
  top: 10px;
  right: 20px;
  display: none;
}
</style>
