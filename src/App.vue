<template>
  <router-view />
</template>

<script setup>
//
</script>
<style>
body {
  font-size: 13px;
}
.search-wrap {
  background-color: #fafafa;
  padding: 25px 20px;
}
.search-wrap span.label {
  width: 15%;
  display: block;
}
.search-wrap .content {
  width: 80%;
  margin-left: 5%;
}
.edit-btn-wrap {
  margin-top: 24px;
  margin-bottom: 16px;
}
.btn {
  padding: 8px 24px;
}

/* */
:root {
  --q-primary: #4f82f8;
}
.q-btn {
  font-weight: 350 !important;
  border-radius: 6px;
}
.q-table {
  border-top: 2px solid rgba(0, 0, 0, 0.12);
}
.q-table thead tr.q-tr {
  height: 35px;
}
.q-table thead tr.q-tr th {
  padding: 5px 10px !important;
  height: 35px;
  background-color: #fafafa !important;
  font-weight: 550;
}
</style>
