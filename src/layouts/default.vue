<template>
  <q-layout view="hHh Lpr lff">
    <q-header unelevated class="bg-white text-black border-bottom">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App</q-toolbar-title>

        <q-btn icon="exit_to_app" :ripple="false" flat dense rounded />
      </q-toolbar>
    </q-header>

    <DefaultAside v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<route lang="yaml">
meta:
  layout: default
</route>
