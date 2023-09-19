<template>
  <UiContainer>
    <UiCard>
      <template v-for="(parent, i) in formData" :key="parent.name + '-' + i">
        <UiCard>
          <!-- Parent -->
          <component
            v-if="parent?.sub"
            :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: formData[i].value }"
            @update:modelValue="(e) => onChange(e, parent.name, parent.type)"
          >
            <UiCard :border="true" v-if="formData[i].value">
              <!-- Child -->
              <component
                v-for="(child, j) in parent.sub"
                :key="i + '-' + j"
                :is="getComponent(child.type)"
                v-bind="{ parent: child, modelValue: formData[i].sub[j].value }"
                @update:modelValue="(e) => onChange(e, child.name, child.type)"
              >
              </component>
            </UiCard>
          </component>

          <!-- Hiding nested fields (Chilren) and showind single components -->
          <component
            v-else-if="!parent?.parent"
            :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: formData[i].value }"
            @update:modelValue="(e) => onChange(e, parent.name, parent.type)"
          >
          </component>
        </UiCard>

        <div
          v-if="i + 1 != formData.length && !parent?.parent"
          class="mt-4 border"
        />
      </template>
    </UiCard>

    <!-- Filters -->
    <UiFilters @clearAll="onClearAll">
      <UiBadge
        v-for="(value, name) in filterState"
        :key="name + '-' + value"
        @click="onClear(name)"
      >
        {{ getLabel(name) }}: ({{ value.toString() }})
      </UiBadge>
    </UiFilters>
  </UiContainer>
</template>

<script setup>
// todo: for clean code just ask about components
import fakeData from "./json/fake-date";

import InputField from "./components/input/field.vue";
import InputDropdown from "./components/input/dropdown.vue";
import InputCheckbox from "./components/input/checkbox.vue";

const router = useRouter();
const filterState = ref({ ...router.currentRoute.value.query });
const formData = ref(fakeData);

const getComponent = (cType) => {
  switch (cType) {
    case "text":
    case "number":
    case "textarea":
      return InputField;
    case "dropdown":
      return InputDropdown;
    case "checkbox":
    case "checkbox-group":
      return InputCheckbox;
  }
};

const getLabel = (name) => {
  const index = formData.value.findIndex((v) => v.name == name);
  return formData.value[index].label;
};

function setFilterState(filterState) {
  router.push({
    path: "/",
    query: filterState,
  });
}

function onChange(e, name, type) {
  if (e) filterState.value[name] = e;
  else {
    delete filterState.value[name];
    clearItems(name);
  }

  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x];
    if (name == item.name) {
      const v = e?.target ? e.target.value : e;
      formData.value[x] = { ...item, value: v };
      break;
    }
  }

  setFilterState(filterState.value);
}

function clearItems(name = "all") {
  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x];
    if (name == "all") {
      formData.value[x].value = item.type == "checkbox-group" ? [] : null;
    } else {
      if (name == item.name || name == item.parent) {
        formData.value[x].value = item.type == "checkbox-group" ? [] : null;
      }
    }
  }
}

function onClear(name) {
  delete filterState.value[name];
  clearItems(name);
  setFilterState(filterState.value);
}

function onClearAll() {
  filterState.value = [];
  clearItems();
  setFilterState(filterState.value);
}

window.onpopstate = function (event) {
  function urlQueryToObject(queryString) {
    queryString = queryString.slice(2); // remove /? from the
    const params = new URLSearchParams(queryString);
    const result = {};

    for (const [key, value] of params.entries()) {
      if (key in result) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  filterState.value = urlQueryToObject(event.state.current);
  // console.error("onpopstate");
  mapObject();
};

function mapObject() {
  // iterating through the formDate to
  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x];

    item.value = null;
    if (item.name in filterState.value) {
      let v = filterState.value[item.name];
      if (v == "true") v = true;
      else if (v == "false") v = false;
      item.value = v;
    }

    if (item?.children || item?.parent) {
      // item is parent
      if (item?.children) {
        formData.value[x] = { ...item, sub: [] }; // pushing parent
        for (let i = 0; i < item.children.length; i++) {
          const childName = item.children[i];
          for (let j = 0; j < formData.value.length; j++) {
            const data = formData.value[j];
            if (childName == data.name) {
              formData.value[x].sub.push(data);
            }
          }
        }
      }
    } else if (item.type == "checkbox-group") {
      if (!item.value?.length) item.value = [];
      formData.value[x] = item;
    }
  }
};

mapObject();
</script>
