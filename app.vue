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
                :key="i + '-' + j + '-' + child.value"
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

    <UiFilters class="mt-10" @clearAll="onClearAll">
      <template v-for="(value, name) in filterState">
        <UiBadge @click="onClear(name)">
          {{ getLabel(name) }}: ({{ value.toString() }})
        </UiBadge>
      </template>
    </UiFilters>
  </UiContainer>
</template>

<script setup lang="ts">
// todo: for clean code just ask about components
import InputField from "./components/input/field.vue";
import InputDropdown from "./components/input/dropdown.vue";
import InputCheckbox from "./components/input/checkbox.vue";
import fakeData from "./json/fake-date";

const router = useRouter();
const route = useRoute();
const filterState = ref({});
const formData = ref(fakeData);

const getComponent = (cType: string) => {
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

function getLabel(name: string) {
  const index = formData.value.findIndex((v) => v.name == name);
  return formData.value[index].label;
}

function onChange(e: { target: { value: any } }, name: string, type: string) {
  if (e) {
    filterState.value[name] = e;
    // formData[i].sub[j].value
  } else {
    delete filterState.value[name];
    clearItems(name);
  }

  const v = e?.target ? e.target.value : e;
  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x];
    if (name == item.name) {
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
      if (name == item.name) {
        formData.value[x].value = item.type == "checkbox-group" ? [] : null;
        // when child is removed,
        //item.parent
        for (let y = 0; y < formData.value.length; y++) {
          if (item.parent == formData.value[y].name) {
            for (
              let k = 0;
              k < Object.keys(formData.value[y].sub).length;
              k++
            ) {
              if (formData.value[y].sub[k].name == name) {
                formData.value[y].sub[k].value = null;
                formData.value[y].sub[k] = {
                  ...formData.value[y].sub[k],
                  value: null,
                };
                break;
              }
            }
          }
        }
      } else if (name == item.parent) {
        formData.value[x].value = item.type == "checkbox-group" ? [] : null;
        delete filterState.value[item.name];
      }
    }
  }
}

function onClear(name: string) {
  delete filterState.value[name];
  clearItems(name);
  setFilterState(filterState.value);
}

function onClearAll() {
  filterState.value = {};
  clearItems();
  setFilterState(filterState.value);
}

window.onpopstate = function (event) {
  filterState.value = getConvertedQuery();
  mapObject();
};

function createQuery(filterState: { [key: string]: string | number }) {
  // example:
  // ?name1=value1&name2=value2&name3=v1,v2,v3
  // ?name1~value1+name2~v1--v2--v3
  let query = "";
  Object.keys(filterState).forEach((name) => {
    if (filterState[name] instanceof Object) {
      if (filterState[name].length != 0) {
        query += `${name}~`;
        const end = filterState[name].length;
        for (let x = 0; x < end; x++) {
          query += filterState[name][x];
          if (x + 1 != end) query += "--";
        }
        query += "+";
      }
    } else {
      query += `${name}~${filterState[name]}+`;
    }
  });
  if (query.charAt(query.length - 1) == "+") query = query.slice(0, -1);
  return query;
}

function setFilterState(filterState: {}) {
  const query = createQuery(filterState);
  router.push(encodeURI("/?" + query));
}

function getConvertedQuery() {
  let queryString: string = route.fullPath.replace("/", "").replace("?", "");
  const result: { [key: string]: any } = {};
  if (queryString) {
    const query: Array<string> = queryString.split("+");
    for (let i in query) {
      let [key, value]: [string, string | boolean] = query[i].split("~");

      if (value.includes("--")) result[key] = value.split("--");
      else {
        // This is for query params (true and false are string here)
        switch (value) {
          case "true":
            value = true;
            break;
          case "false":
            value = false;
            break;
        }
        result[key] = value;
      }
    }
  }
  return result;
}

function mapObject() {
  filterState.value = getConvertedQuery();

  // iterating through the formDate to
  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x];

    item.value = filterState.value[item.name]; // returns null if not available

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
}

mapObject();
</script>
