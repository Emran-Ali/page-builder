<script setup>
import DataTableComponent from '~/components/BuilderComponents/DataTable/DataTableComponent.vue'
import TableComponent from '~/components/BuilderComponents/Table/TableComponent.vue'
import AccordionComponent from '../BuilderComponents/Accordion/AccordionComponent.vue'
import ButtonComponent from '../BuilderComponents/Button/ButtonComponent.vue'
import CardComponent from '../BuilderComponents/Card/CardComponent.vue'
import CTAComponent from '../BuilderComponents/CTA/CTAComponent.vue'
import GridComponent from '../BuilderComponents/Grid/GridComponent.vue'
import GridBlockComponent from '../BuilderComponents/GridBlock/GridBlockComponent.vue'
import ImageComponent from '../BuilderComponents/Image/ImageComponent.vue'
import ListItemComponent from '../BuilderComponents/ListItem/ListItemComponent.vue'
import MapBlockComponent from '../BuilderComponents/MapBlock/MapBlockComponent.vue'
import OfflineTeacherListComponent from '../BuilderComponents/OfflineTeacherList/OfflineTeacherListComponent.vue'
import SearchOfflineTeacherComponent from '../BuilderComponents/SearchOfflineTeacher/SearchOfflineTeacherComponent.vue'
import TeacherListComponent from '../BuilderComponents/TeacherList/TeacherListComponent.vue'
import TestimonialComponent from '../BuilderComponents/Testimonial/TestimonialComponent.vue'
import TextComponent from '../BuilderComponents/Text/TextComponent.vue'
import TextImageComponent from '../BuilderComponents/TextImage/TextImageComponent.vue'

import RTEComponent from '../BuilderComponents/RTF/RTEComponent.vue'
import TeacherFinderBlockComponent from '../BuilderComponents/TeacherFinderBlock/TeacherFinderBlockComponent.vue'

defineProps({
  component: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:props'])

const componentMap = {
  table: TableComponent,
  datatable: DataTableComponent,
  card: CardComponent,
  grid: GridComponent,
  text: TextComponent,
  image: ImageComponent,
  button: ButtonComponent,
  accordion: AccordionComponent,
  textimage: TextImageComponent,
  testimonial: TestimonialComponent,
  gridblock: GridBlockComponent,
  cta: CTAComponent,
  listitem: ListItemComponent,
  mapblock: MapBlockComponent,
  teacherlist: TeacherListComponent,
  searchofflineteacher: SearchOfflineTeacherComponent,
  offlineteacherlist: OfflineTeacherListComponent,
  teacherfinderblock: TeacherFinderBlockComponent,
  rte: RTEComponent,
}
</script>

<template>
  <component
    :is="componentMap[component.type]"
    v-bind="component.props"
    :id="component.id"
    :is-editing="isEditing"
    @update:props="$emit('update:props', $event)"
  />
</template>
