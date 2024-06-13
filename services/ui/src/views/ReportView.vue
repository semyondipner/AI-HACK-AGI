<script setup lang="ts">
import { AppConfig } from '@/services/AppConfig';
import { ApiService, } from '@/services/ApiService';
import { type Report, type ReportDocument, type ReportTemplate, type ReportTopic } from '@/models/entities';
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
  VProgressCircular,
  VSheet,
  VToolbarTitle,
} from 'vuetify/components';
import Crud, { type CrudConfig, type CrudDtHeaders } from '@/components/Crud.vue';
import ReportTopicView from '@/components/ReportTopicView.vue';
import { indexBy } from '@/utils/collections';
import ReportParamEditor from '@/components/ReportParamEditor.vue';
import { mdiCogPlayOutline, mdiFileEye } from '@mdi/js';
import { useRoute } from 'vue-router';
import VueMarkdown from 'vue-markdown-render'

const appConfig = useService(AppConfig);
const apiService = useService(ApiService);

const pageStore = usePageStore();

const route = useRoute()

const report = ref<Report>()

const update = async () => {
  pageStore.setTitle('Просмотр отчёта');

  report.value = await apiService.getReport(Number(route.params.id), { withDocuments: true })
  const docs = report.value?.documents;
  if (docs) {
    selectedDocument.value = docs[docs.length - 1]
  }
}

onBeforeMount(update);

const loading = ref(false)

const documents = computed(() => report.value?.documents || [])

const runGenerate = async () => {
  if (!report.value) {
    return;
  }
  loading.value = true;

  await apiService.generateReport(report.value.id);
  await update();

  loading.value = false;
}

const selectedDocument = ref<ReportDocument>()

// const reportTopicsCrud = apiService.getReportTopicsCrud();
// const reportTemplatesCrud = apiService.getReportTemplatesCrud();

// {{ route.params.id }}
</script>

<template>
  <VToolbar flat>
    <VToolbarTitle>{{ report?.title }}</VToolbarTitle>
    <VSpacer />
    <VDivider class="mx-4" inset vertical />
    <VBtn color="primary" @click="runGenerate()" :prepend-icon="mdiCogPlayOutline">Сгенерировать</VBtn>
  </VToolbar>
  <VSheet elevation="5" class="ma-3 pa-3" v-if="loading">
    <div class="text-center">
      <VProgressCircular indeterminate></VProgressCircular>
    </div>
  </VSheet>
  <VSheet elevation="5" class="ma-3 pa-3">
    <VSelect v-model="selectedDocument" :items="documents" clearable label="Документ" return-object item-value="id"
      item-title="name">
      <template v-slot:selection="{ item }">#{{ item.raw.id }}: {{ item.raw.name }}, {{ item.raw.createdAt }}</template>
      <template v-slot:item="{ props, item }">
        <VListItem v-bind="props" :subtitle="'#' + item.raw.id + ' ' + item.raw.createdAt" />
      </template>
    </VSelect>
  </VSheet>
  <VSheet elevation="2" class="ma-3 pa-3 markdown-render" v-if="selectedDocument?.content">
    <VueMarkdown :source="selectedDocument?.content" />
  </VSheet>

</template>

<style lang="scss" scoped>
.markdown-render {
  :deep() {

    ul,
    ol {
      margin-left: 20px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0.5em;
      margin-bottom: 0.25em;
    }

    p {
      margin-bottom: 0.25em;
    }

    pre {
      background: #eee;
      padding: 1em;
      margin-top: 1em;
      margin-bottom: 1em;     
      overflow: auto;
      max-width: 100%;
    }
  }
}
</style>
