<script lang="ts" setup>
import {ErrorMessage, Field, useForm} from "vee-validate";
import {pageSchema, type PageCreate} from "./pageHelper";
import {useToast} from "primevue/usetoast";
import {useRouter} from "#app";
import {navigateTo} from "#app";
import {defineEmits, computed} from "vue";

const emits = defineEmits(["cancel", "success"]);

interface PageFormProps {
  id?: string;
  isEdit?: boolean;
}
const {is} = useGlobalStore();

const props = defineProps<PageFormProps>();
const generateSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const defaultValues: PageCreate = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featuredImage: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  schema: undefined,
};

const {handleSubmit, setValues, setFieldValue, errors} = useForm({
  validationSchema: pageSchema,
  initialValues: defaultValues,
  validateOnMount: false,
});

const pageStore = usePageCrudStore();
const toast = useToast();
const router = useRouter();

const currentPage = computed(() => pageStore.currentPage);

onMounted(() => {
  if (props.isEdit && props.id) {
    // Fetch page data and populate form
    pageStore.getPageById(props.id).then(() => {
      const page = pageStore.currentPage;
      if (page) {
        setValues({
          title: page.title,
          slug: page.slug,
          content: page.pageJson,
          excerpt: page.excerpt,
          featuredImage: page.featuredImage,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          seoKeywords: page.seoKeywords,
          schema: page.schema,
        });
      }
    });
  }
});

const onSubmit = handleSubmit(async (values: PageCreate) => {
  try {
    if (props.isEdit && props.id) {
      // Update existing page - use PATCH endpoint with all fields
      const axios = getUserAxios();
      await axios.patch(`/api/pages/${props.id}`, {
        slug: values.slug,
        title: values.title,
        excerpt: values.excerpt || null,
        pageJson: values.content,
        featuredImage: values.featuredImage || null,
        seoTitle: values.seoTitle || null,
        seoDescription: values.seoDescription || null,
        seoKeywords: values.seoKeywords || null,
        schema: values.schema,
        isPublished: true,
      });
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Page updated successfully",
        life: 3000,
      });
    } else {
      // Create new page
      const axios = getUserAxios();
      const response = await axios.post(`/api/pages/`, {
        slug: values.slug,
        title: values.title,
        excerpt: values.excerpt || null,
        pageJson: values.content,
        featuredImage: values.featuredImage || null,
        seoTitle: values.seoTitle || null,
        seoDescription: values.seoDescription || null,
        seoKeywords: values.seoKeywords || null,
        schema: values.schema,
        isPublished: true,
      });
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Page created successfully",
        life: 3000,
      });
    }

    // Emit success event to close dialog
    emits("success");

    // Navigate to pages list after a short delay to allow toast to show
    setTimeout(() => {
      router.push("/pages/pages");
    }, 1500);
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Failed to save page",
      life: 3000,
    });
  }
});

const handleSlugChange = (value: string | undefined) => {
  const slug = generateSlug(value ?? "");
  setFieldValue("slug", slug);
};

const editOnPageBuilder = () => {
  navigateTo(`/builder/${props?.slug}`);
};
</script>

<template>
  <form @submit="onSubmit">
    <div class="flex items-start gap-6 mt-5">
      <div class="sm:w-[calc(100%-320px)] w-full">
        <div class="p-4 border rounded-lg w-full">
          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="title">
              <div class="space-y-1">
                <label class="paragraph_black" for="title">Page title</label>
                <InputText
                  :invalid="Boolean(errorMessage)"
                  class="w-full"
                  placeholder="Enter the slug"
                  v-bind="field"
                  @update:model-value="handleSlugChange"
                />
                <ErrorMessage class="text-red-500 text-sm" name="title" />
              </div>
            </Field>
          </div>

          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="slug">
              <div class="space-y-1">
                <label class="paragraph_black" for="slug">Url slug</label>
                <InputGroup>
                  <InputGroupAddon
                    >https://www.craft-music.com/page/</InputGroupAddon
                  >
                  <InputText
                    :invalid="Boolean(errorMessage)"
                    class="w-full"
                    placeholder="Enter the slug"
                    size="small"
                    v-bind="field"
                  />
                </InputGroup>
                <ErrorMessage class="text-red-500 text-sm" name="slug" />
              </div>
            </Field>
          </div>

          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="content">
              <div class="space-y-1">
                <label class="paragraph_black" for="content"
                  >Page content
                  <!-- <span
                    v-if="props.isEdit && currentPage?.slug"
                    class="text-primary font-normal"
                    >or edit on page builder
                  </span> -->
                </label>

                <SharedGlobalEditor
                  v-model="field.value"
                  :error-message="errorMessage"
                  :invalid="Boolean(errorMessage)"
                  editor-style="min-height: 320px"
                  field-name="file"
                  placeholder="Write your page content here..."
                  upload-endpoint="page-image"
                  @blur="field.onBlur"
                  @update:model-value="field.onChange"
                />
                <ErrorMessage class="text-red-500 text-sm" name="content" />
              </div>
            </Field>
          </div>
          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="excerpt">
              <div class="space-y-1">
                <label class="paragraph_black" for="excerpt"
                  >Post Excerpt</label
                >
                <Textarea
                  :invalid="Boolean(errorMessage)"
                  auto-resize
                  class="w-full"
                  placeholder="Write a brief summary of your post..."
                  rows="3"
                  size="small"
                  v-bind="field"
                />
                <ErrorMessage class="text-red-500 text-sm" name="excerpt" />
              </div>
            </Field>
          </div>
        </div>

        <div class="mt-5 p-4 rounded-lg w-full border">
          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="seoTitle">
              <div class="space-y-1">
                <label class="paragraph_black" for="seoTitle">SEO title</label>
                <InputText
                  :invalid="Boolean(errorMessage)"
                  class="w-full"
                  placeholder="Enter a search-friendly title..."
                  v-bind="field"
                />
                <ErrorMessage class="text-red-500 text-sm" name="seoTitle" />
              </div>
            </Field>
          </div>
          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="seoDescription">
              <div class="space-y-1">
                <label class="paragraph_black" for="seoDescription"
                  >SEO description</label
                >
                <Textarea
                  :invalid="Boolean(errorMessage)"
                  auto-resize
                  class="w-full"
                  placeholder="Write a short description for search engines..."
                  rows="3"
                  size="small"
                  v-bind="field"
                />
                <ErrorMessage
                  class="text-red-500 text-sm"
                  name="seoDescription"
                />
              </div>
            </Field>
          </div>
          <div class="my-2">
            <Field v-slot="{field, errorMessage}" name="seoKeywords">
              <div class="space-y-1">
                <label class="paragraph_black" for="seoKeywords"
                  >SEO Meta Keywords</label
                >
                <InputText
                  :invalid="Boolean(errorMessage)"
                  class="w-full"
                  placeholder="Enter meta keywords separated by commas (e.g., music lessons, guitar, online learning)..."
                  v-bind="field"
                />
                <ErrorMessage class="text-red-500 text-sm" name="seoKeywords" />
              </div>
            </Field>
          </div>
        </div>
      </div>

      <div class="sm:w-[320px] w-full">
        <div class="p-4 mt-5 border rounded-lg">
          <div class="space-y-1">
            <Field v-slot="{field, errorMessage}" name="featuredImage">
              <div class="space-y-1 mt-3">
                <label class="paragraph_black" for="featuredImage"
                  >Choose a Feature Image</label
                >
                <SharedUploadImageUploader
                  :error-message="errorMessage"
                  endpoint="page-image"
                  field-name="file"
                  v-bind="field"
                />
                <ErrorMessage
                  class="text-red-500 text-sm mt-1"
                  name="featuredImage"
                />
              </div>
            </Field>
          </div>
        </div>

        <Button class="w-full mt-5" type="submit">
          {{ props.isEdit ? "Save Changes" : "Create Page" }}
          <Icon
            v-if="is('editPageHandler') || is('createPageHandler')"
            class="animate-spin"
            name="lucide:loader"
          />
        </Button>
        <div v-if="props.isEdit && currentPage?.slug" class="mt-5">
          <Button
            class="w-full"
            type="button"
            variant="outlined"
            @click="editOnPageBuilder"
          >
            <Icon name="lucide:external-link" />
            Edit on page builder
          </Button>
          <span class="text-xs text-gray-500 block mt-2">
            <strong>Note:</strong> Editing with the page builder will take
            priority over the content entered above. Changes made in the builder
            will overwrite the current page content.
          </span>
        </div>
      </div>
    </div>
  </form>
</template>
