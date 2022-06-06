<template>
    <div>
    </div>
</template>

<script>
export default {
    created() {
        this.$router.replace({
          name: 'pesquisa',
          query: {
              texto: this.$route.query.texto,
              categoria: this.$route.query.categoria,
              sort: this.$route.query.sort,
              maiorPreco: this.$route.query.maiorPreco
            }
        });
    },
}
</script>