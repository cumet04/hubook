<template>
  <iframe
    sandbox="allow-same-origin"
    :style="{ height: height + 'px' }"
  ></iframe>
</template>

<script>
export default {
  props: ["content"],
  data: () => ({
    height: 0,
  }),
  mounted() {
    const doc = this.$el.contentDocument;
    doc.head.innerHTML =
      '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">';
    doc.body.className = "markdown-body"; // github-markdown-css's parent class
    doc.body.style.margin = "0"; // make inner.body.offsetHeight equal to content height
    doc.body.style.height = "fit-content"; // 明示的に指定しない場合、縦長のcommentを表示 -> 短いのを表示
    // した場合に直前のiframeのheightに引っ張られて大きいままになる
    this.updateContent();
  },
  methods: {
    updateContent() {
      const doc = this.$el.contentDocument;
      doc.body.innerHTML = this.content;
      this.height = doc.body.offsetHeight;
    },
  },
  watch: {
    content() {
      this.updateContent();
    },
  },
};
</script>

<style scoped>
iframe {
  border: none;
}
</style>
