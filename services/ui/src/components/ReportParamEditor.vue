<script lang="ts" setup>
import { VSheet } from 'vuetify/components'
import { FormKitSchema, FormKit } from '@formkit/vue'
import { type FormKitGroupValue } from '@formkit/core'
import { ref, computed, type Ref, onMounted } from 'vue';
import { DEFAULT_SCHEMA, SOURCES_ELEMENT, templateSchemas } from '@/models/template-schemas';
import { useService } from '@/utils/di';
import { ApiService } from '@/services/ApiService';
import type { ReportSource } from '@/models/entities';

const apiService = useService(ApiService);
const sourcesCrud = apiService.getSourcesCrud()

const sources: Ref<ReportSource[]> = ref([]);

const model = defineModel<FormKitGroupValue>()

const props = defineProps<{
  schemaName?: string,
}>();

const schema = computed(() => {
  const ret = templateSchemas[String(props.schemaName)] || templateSchemas[DEFAULT_SCHEMA];
  const sourcesOptions = sources.value.map(({ url, title }) => ({ value: url, label: `${url} - ${title}` }));

  return ret.map((item: any) => {
    if (item.name === SOURCES_ELEMENT) {
      return { ...item, options: sourcesOptions };
    }
    return item;
  })
})

onMounted(async () => {
  sources.value = (await sourcesCrud.read({})).items;
});

</script>

<template>
  <VSheet class="pa-4 mx-auto" elevation="6" rounded="lg">
    <div class="text-h5 mb-6">Настройка параметров</div>
    <FormKit type="form" v-model="model" :actions="false">
      <FormKitSchema :schema="schema" />
    </FormKit>
  </VSheet>
</template>
