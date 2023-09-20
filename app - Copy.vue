<template>
  <UiContainer>
    <UiCard>
      <template v-for="(parent, i) in form" :key="parent.name + '-' + i">
        <UiCard>
          <!-- Parent -->
          <component
            v-if="parent?.sub"
            :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: form[i].value }"
            @update:modelValue="(e) => onChange(e, parent.name, parent.type)"
          >
            <UiCard :border="true" v-if="form[i].value">
              <!-- Child -->
              <component
                v-for="(child, j) in parent.sub"
                :key="i + '-' + j + '-' + child.value"
                :is="getComponent(child.type)"
                v-bind="{ parent: child, modelValue: form[i].sub[j].value }"
                @update:modelValue="(e) => onChange(e, child.name, child.type)"
              >
              </component>
            </UiCard>
          </component>

          <!-- Hiding nested fields (Chilren) and showind single components -->
          <component
            v-else-if="!parent?.parent"
            :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: form[i].value }"
            @update:modelValue="(e) => onChange(e, parent.name, parent.type)"
          >
          </component>
        </UiCard>

        <div
          v-if="i + 1 != form.length && !parent?.parent"
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
import InputField from "./components/input/field.vue";
import InputDropdown from "./components/input/dropdown.vue";
import InputCheckbox from "./components/input/checkbox.vue";
import fakeData from "./json/fake-date";

const router = useRouter();
const route = useRoute();
const filterState = ref({});
const form = ref(fakeData);

/**
 * Description
 * @param {string} cType
 * @returns {any}
 */
function getComponent(cType: string) {
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
}

/**
 * Description
 * @param {string} name
 * @returns {any}
 */
function getLabel(name: string) {
  const index = form.value.findIndex((v) => v.name == name);
  return form.value[index].label;
}

/**
 * Description
 * @param {any} e:{target:{value:any}}
 * @param {string} name
 * @param {string} type
 * @returns {any}
 */
function onChange(e: { target: { value: any } }, name: string, type: string) {
  if (e) {
    filterState.value[name] = e;
  } else {
    delete filterState.value[name];
    clearItems(name);
  }

  const v = e?.target ? e.target.value : e;
  for (let x = 0; x < form.value.length; x++) {
    const field = form.value[x];
    if (name == field.name) {
      form.value[x] = { ...field, value: v };
      break;
    }
  }

  setFilterState(filterState.value);
}

/**
 * Description
 * @param {any} name="all"
 * @returns {any}
 */
function clearItems(name = "all") {
  for (let x = 0; x < form.value.length; x++) {
    const field = form.value[x];
    if (name == "all") {
      form.value[x].value = field.type == "checkbox-group" ? [] : null;
    } else {
      if (name == field.name) {
        form.value[x].value = field.type == "checkbox-group" ? [] : null;
        // when child is removed,
        //field.parent
        for (let y = 0; y < form.value.length; y++) {
          if (field.parent == form.value[y].name) {
            for (let k = 0; k < Object.keys(form.value[y].sub).length; k++) {
              if (form.value[y].sub[k].name == name) {
                form.value[y].sub[k].value = null;
                form.value[y].sub[k] = {
                  ...form.value[y].sub[k],
                  value: null,
                };
                break;
              }
            }
          }
        }
      } else if (name == field.parent) {
        form.value[x].value = field.type == "checkbox-group" ? [] : null;
        delete filterState.value[field.name];
      }
    }
  }
}

/**
 * Description
 * @param {string} name
 * @returns {any}
 */
function onClear(name: string) {
  delete filterState.value[name];
  clearItems(name);
  setFilterState(filterState.value);
}

/**
 * Description
 * @returns {any}
 */
function onClearAll() {
  filterState.value = {};
  clearItems();
  setFilterState(filterState.value);
}

/**
 * Description
 * @param {any} event
 * @returns {any}
 */
window.onpopstate = function (event) {
  filterState.value = getConvertedQuery();
  mapObject();
};

/**
 * Description
 * @param {any} filterState:{[key:string]:string|number}
 * @returns {any}
 */
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

/**
 * Description
 * @param {{}} filterState
 * @returns {any}
 */
function setFilterState(filterState: {}) {
  const query = createQuery(filterState);
  router.push(encodeURI("/?" + query));
}

/**
 * Description
 * @returns {any}
 */
function getConvertedQuery() {
  // getting query params
  let queryString: string = route.fullPath.replace("/", "").replace("?", "");

  const result: { [key: string]: any } = {};

  try {
    if (queryString) {
      const query: Array<string> = queryString.split("+");
      for (let i in query) {
        let [key, value]: [string, string | boolean] = query[i].split("~");

        if (value.includes("--")) result[key] = value.split("--");
        else {
          // This is for query params (true and false are string here)
          if (["true", "false"].includes(value)) value = Boolean(value);
          result[key] = value;
        }
      }
    }
  } catch (error) {
    throw new Error("Wronge query params or text input", error);
  }

  return result;
}

/**
 * Description
 * @returns {any}
 *
 *
 */
function mapObject() {
  filterState.value = getConvertedQuery();

  // iterating through the formDate to
  for (let index = 0; index < form.value.length; index++) {
    const field = form.value[index];

    // initializing every field value
    field.value = filterState.value[field.name]; // returns null if not available

    if (field?.children || field?.parent) {
      // field is parent so it has children
      if (field?.children) {
        // Add subtree to parent
        form.value[index] = { ...field, sub: [] };

        // iterating through children to push children from origina form  to make subtree
        for (let i = 0; i < field.children.length; i++) {
          const childName = field.children[i];
          
          for (let j = 0; j < form.value.length; j++) {
            const data = form.value[j];
            if (childName == data.name) {
              form.value[index].sub.push(data);
            }
          }
        }
      }
    } else if (field.type == "checkbox-group") {
      if (!field.value?.length) field.value = [];
      form.value[index] = field;
    }
  }
}

mapObject();
</script>
