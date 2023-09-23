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
            <UiTransitionFade>
              <UiCard :border="true" v-if="form[i].value">
                <!-- Child -->
                <component
                  v-for="(child, j) in parent.sub"
                  :key="i + '-' + j + '-' + child.value"
                  :is="getComponent(child.type)"
                  v-bind="{ parent: child, modelValue: form[i].sub[j].value }"
                  @update:modelValue="
                    (e) => onChange(e, child.name, child.type)
                  "
                >
                
                </component>
              </UiCard>
            </UiTransitionFade>
          </component>

          <!-- Hiding nested fields (Chilren) and showing single components -->
          <component
            v-else-if="!isChild(parent)"
            :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: form[i].value }"
            @update:modelValue="(e) => onChange(e, parent.name, parent.type)"
          >
          </component>
        </UiCard>

        <div
          v-if="i + 1 != form.length && !isChild(parent)"
          class="mt-4 border"
        />
      </template>
    </UiCard>

    <UiFilters class="mt-10" @clearAll="onClearAll">
      <template v-for="(value, name) in filterState">
        <UiBadge @click="onClear(name)">
          {{ getFieldLabel(name) }}: ({{ value.toString() }})
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

mapFilterToForm();

function onChange(eventValue: any, name: string, type: string) {
  setFilterState(eventValue, name);
  setUrl();
}

function setFilterState(
  eventValue: boolean | number | string | Array<T>,
  name: string
) {
  if (eventValue != "") {
    // inserting value
    filterState.value[name] = eventValue;

    // updating field value when parent has children
    for (let index = 0; index < form.value.length; index++) {
      const field = form.value[index];
      if (name == field.name) {
        form.value[index] = { ...field, value: eventValue };
        // if (eventValue === false) delete filterState.value[name];

        // runs only if is child & checkbox-group
        if (isChild(field) && form.value[index].type == "checkbox-group") {
          // Iterating to find and reset children's value
          for (let y = 0; y < form.value.length; y++) {
            // finding fathers field to update subtree
            if (field.parent == form.value[y].name) {
              // iterating through subtree
              for (let k = 0; k < Object.keys(form.value[y].sub).length; k++) {
                if (form.value[y].sub[k].name == name) {
                  form.value[y].sub[k].value = eventValue;
                  if (eventValue.length == 0) delete filterState.value[name];
                  break;
                }
              }
            }
          }
        }

        break;
      }
    }
  } else {
    // removing value
    delete filterState.value[name];
    clearFieldsByName(name);
  }
}

function clearFieldsByName(name = undefined) {
  if (name) {
    for (let x = 0; x < form.value.length; x++) {
      const field = form.value[x];

      // finding field
      if (name == field.name) {
        form.value[x].value = returnValue(field.type);

        if (isChild(field)) {
          // Iterating to find and reset children's value
          for (let y = 0; y < form.value.length; y++) {
            // finding fathers field to update subtree
            if (field.parent == form.value[y].name) {
              // iterating through subtree
              for (let k = 0; k < Object.keys(form.value[y].sub).length; k++) {
                // TODO
                if (form.value[y].sub[k].name == name) {
                  form.value[y].sub[k] = {
                    ...form.value[y].sub[k],
                    value: returnValue(form.value[y].sub[k].type),
                  };
                  break;
                }
              }
            }
          }
        }
      } else if (name == field.parent) {
        // finding field's parent
        form.value[x].value = returnValue(field.type);
        delete filterState.value[field.name];

        if (isChild(field)) {
          // Iterating to find and reset children's value
          for (let y = 0; y < form.value.length; y++) {
            // finding fathers field to update subtree
            if (field.parent == form.value[y].name) {
              // iterating through subtree
              for (let k = 0; k < Object.keys(form.value[y].sub).length; k++) {
                // TODO
                if (form.value[y].sub[k].name == field.name) {
                  form.value[y].sub[k].value = returnValue(
                    form.value[y].sub[k].type
                  );
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  // Reset all fields
  if (!name) {
    for (let x = 0; x < form.value.length; x++) {
      const field = form.value[x];
      form.value[x].value = returnValue(field.type);
    }
  }
}

function onClear(name: string) {
  delete filterState.value[name];
  clearFieldsByName(name);
  setUrl();
}

function onClearAll() {
  filterState.value = {};
  clearFieldsByName();
  setUrl();
}

function urlStringify(filterState: { [key: string]: string | number }) {
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

function urlParser(): object {
  // getting query params
  let queryString: string = route.fullPath.replace("/", "").replace("?", "");

  const result: { [key: string]: any } = {};

  if (queryString == null || queryString == "") return result;

  try {
    let lastKey = null;
    const query: Array<string> = queryString.split("+");
    for (let i in query) {
      if (query[i].includes("~")) {
        let [key, value]: [string, string | boolean] = query[i].split("~");
        lastKey = key;
        if (value.includes("--")) result[key] = value.split("--");
        else {
          // This is for query params (true and false are string here)
          if (["true", "false"].includes(value)) value = Boolean(value);
          result[key] = value;
        }
      } else {
        // Edge cases
        if (query[i] == "") result[lastKey] += "+";
        else result[lastKey] += " " + query[i];
      }
    }
  } catch (error) {
    throw new Error("Wronge query params or text input", error);
  }

  return result;
}

// Handling back and forward in browser
window.onpopstate = function (event) {
  filterState.value = urlParser();
  mapFilterToForm();
};

function mapFilterToForm() {
  filterState.value = urlParser();

  // iterating through the formDate to
  for (let index = 0; index < form.value.length; index++) {
    const field = form.value[index];

    // initializing every field value
    field.value = filterState.value[field.name]; // returns null if not available

    if (isParent(field) || isChild(field)) {
      // field is parent so it has children
      if (isParent(field)) {
        // Add subtree to parent
        form.value[index] = { ...field, sub: [] };

        // TODO: these two for are not optimized
        // iterating through children to push children from origina form  to make subtree
        for (let i = 0; i < field.children.length; i++) {
          const childName = field.children[i];

          // populating subtree with its children
          for (let j = 0; j < form.value.length; j++) {
            const data = form.value[j];

            if (childName == data.name) {
              form.value[index].sub.push({
                ...data,
                value: returnValue(data.type),
              });
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

function setUrl() {
  const query = urlStringify(filterState.value);
  router.push(encodeURI("/?" + query));
}

function isParent(field: { children: boolean }): boolean {
  return field.children;
}

function isChild(field: { parent: boolean }): boolean {
  return field.parent;
}

function returnValue(type: string) {
  return type == "checkbox-group" ? [] : null;
}

function getFieldLabel(name: string) {
  const index = form.value.findIndex((v) => v.name == name);
  return form.value[index].label;
}

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
</script>
