<script setup lang="ts">
import { AppConfig } from '@/services/AppConfig';
import { ApiService, } from '@/services/ApiService';
import { type Email, type Report, type ReportTemplate, type ReportTopic } from '@/models/entities';
import { usePageStore } from '@/stores/page';
import { useService } from '@/utils/di';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import {
  VSelect, VTextField, VContainer, VRow, VCol, VListItem, VToolbar, VDivider, VDialog,
  VCard, VCardText,
  VBtn,
  VSpacer,
  VCardTitle,
  VCardActions,
  VIcon,
  VCheckbox,
} from 'vuetify/components';
import Crud, { type CrudConfig, type CrudDtHeaders } from '@/components/Crud.vue';
import ReportTopicView from '@/components/ReportTopicView.vue';
import { indexBy } from '@/utils/collections';
import ReportParamEditor from '@/components/ReportParamEditor.vue';
import { mdiFileEye } from '@mdi/js';
import type { RouteLocationRaw } from 'vue-router';
import { Route } from '@/router';
import { formatDate } from '@/utils/dates';

const appConfig = useService(AppConfig);
const apiService = useService(ApiService);

const pageStore = usePageStore();

onBeforeMount(async () => {
  pageStore.setTitle('Рассылки');
});

const crudProvider: CrudConfig<Email> = {
  headers: [
    { title: 'E-Mail', align: 'start', key: 'email', },
    { title: 'ФИО', key: 'full_name', align: 'start'},
    { title: 'Должность', key: 'job', align: 'start'},
    { title: 'Тематики', key: 'topics', align: 'start' },
    { title: 'Активность', key: 'activity', align: 'start' },
    { title: 'Дата изменения', key: 'updatedAt', align: 'end' },
  ],
  api: apiService.getEmailsCrud(),
};

</script>

<template>
  <Crud :provider="crudProvider">
    <!-- <template v-slot:item.title="{ item }">
      <RouterLink :to="reportToRoute(item)">{{ item.title }}</RouterLink>
    </template>
    <template v-slot:item.template_title="{ item }">
      <div class="mb-1">{{ getReportTemplate(item)?.title }}</div>
      <div class="text-disabled">
        <ReportTopicView :item="getReportTopic(item)" />
      </div>
    </template>
    <template v-slot:item.createdAt="{ item }">
      {{ item?.createdAt.toLocaleDateString() }}
    </template> -->
    <template v-slot:editForm="{ item }">
      <VContainer>
        <VRow>
          <VCol cols="12">
            <VCheckbox v-model="item.activity" label="Активность" />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="item.full_name" label="ФИО"></VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField v-model="item.email" label="E-Mail"></VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField v-model="item.job" label="Должность"></VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField v-model="item.topics" label="Тематики"></VTextField>
          </VCol>
        </VRow>
      </VContainer>
    </template>
  </Crud>
</template>
