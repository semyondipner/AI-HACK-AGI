<script setup lang="ts">
import { VList, VListSubheader, VListItem } from 'vuetify/components';
import {
  mdiViewDashboard,
  mdiFileChart,
  mdiCodeBlockTags,
  mdiSearchWeb,
  mdiAccountWrench,
  mdiApi,
  mdiFrequentlyAskedQuestions,
  mdiBookOpenVariantOutline,
  mdiEmail,
} from '@mdi/js';
import { Route } from '@/router';

const structure = [
  {
    title: 'Конструктор отчётов',
    items: [
      { title: 'Рассылки', route: Route.EMAILS, icon: mdiEmail },
      { title: 'Отчёты', route: Route.REPORTS, icon: mdiFileChart },
      { title: 'Шаблоны', route: Route.REPORT_TEMPLATES, icon: mdiCodeBlockTags },
      { title: 'Источники', route: Route.SOURCES, icon: mdiSearchWeb },
    ],
  },
  {
    title: 'Настройки',
    items: [
      { title: 'Профиль', route: Route.USER_PROFILE, icon: mdiAccountWrench },
      { title: 'Сторонние сервисы', route: Route.API_SETTINGS, icon: mdiApi },
    ],
  },
  {
    title: 'Помощь',
    items: [
      { title: 'FAQ', route: Route.FAQ, icon: mdiFrequentlyAskedQuestions },
      { title: 'Документация', route: Route.DOCS, icon: mdiBookOpenVariantOutline },
    ],
  },
];
</script>
<template>
  <VList>
    <template v-for="{ title, items } in structure">
      <VListSubheader v-if="title">{{ title }}</VListSubheader>
      <VListItem v-for="{ icon, route, title } in items" :prepend-icon="icon" :to="{ name: route }">
        {{ title }}
      </VListItem>
    </template>
  </VList>
</template>
<style scoped lang="scss"></style>
