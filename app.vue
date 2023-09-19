<template>
  <div class="container mx-auto max-w-md py-10">
    <UiCard>
      <template v-for="(parent, i) in formData" :key="parent.name + '-' + i">
        <UiCard>
          <component
            v-if="parent?.sub"
            :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: formData[i].value }"
            @update:modelValue="(e) => onChange(e, parent.name, parent.type)"
          >
            <UiCard :border="true" v-if="formData[i].value">
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
        ></div>
      </template>
    </UiCard>

    <UiFilters class="mt-10" @clearAll="onClearAll">
      <template v-for="(value, name) in filterState">
        <UiBadge @click="onClear(name)">
          {{ getLabel(name) }}: ({{ value.toString() }})
        </UiBadge>
      </template>
    </UiFilters>
  </div>
</template>

<script setup>
// todo: for clean code just ask about components
import InputField from "./components/input/field.vue";
import InputDropdown from "./components/input/dropdown.vue";
import InputCheckbox from "./components/input/checkbox.vue";
import fakeData from "./json/fake-date";

const router = useRouter();
const route = useRoute();
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

function getLabel(name) {
  const index = formData.value.findIndex((v) => v.name == name);
  return formData.value[index].label;
}

function setFilterState(filterState) {
  // let query = filterState
  // make query params here:
  // ?name1=value1&name2=value2&name3=v1,v2,v3
  // ?name1~value1+name2~v1--v2--v3

  // let query = ''
  // Object.keys(filterState).forEach(name => {
  //   // key, filterState[key]
  //   if (typeof filterState[name] == Array) {
  //     query += `${name}~`
  //     filterState[name].forEach(item => {
  //       query += `${item}--`
  //     })
  //     //TODO: remove -- from last part
  //     query = query.slice(0, -2)
  //     query += '+'
  //   } else {
  //     query += `${name}~${filterState[name]}+`
  //   }
  // });
  // query = query.slice(0, -1)

  console.log(JSON.parse(JSON.stringify(filterState)));

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

// Watch for route.query changes
// watchEffect(() => {
//   const currentQuery = router.currentRoute.value.query;
//   console.log("Route query changed: ", currentQuery);
//   console.log("Route query changed: ", router.currentRoute.value);

//   // Perform desired logic with the updated query
//   mapObject();
// });

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
}

// function mapObject(useQuery = true) {

//   // check if query is available
//   if (useQuery && Object.keys(route.query).length != 0) {
//     filterState.value = { ...route.query } // copy object value or it will not work correctly
//   }

//   // iterating through the formDate to
//   for (let x = 0; x < formData.value.length; x++) {
//     const { name, children, parent, 'type': _type } = formData.value[x]

//     // item.value = null
//     let value = null
//     if (name in filterState.value) {
//       let value = filterState.value[name]
//       if (value == 'true') value = true
//       else if (value == 'false') value = false
//     }

//     if (children || parent) { // item is parent
//       if (children) {
//         formData.value[x].sub = [] // creating a sub branch for parent that has its children in 'sub'
//         for (let i = 0; i < children.length; i++) {
//           const childName = children[i];
//           for (let j = 0; j < formData.value.length; j++) {
//             const { 'name': itemName } = formData.value[j];
//             if (childName == itemName) {
//               formData.value[x].sub.push(formData.value[j])
//               break
//             }
//           }
//         }
//       }
//     } else if (_type == 'checkbox-group') {
//       if (!item.value?.length)
//         value = []
//       formData.value[x] = item
//     }
//   }
// }

mapObject();
</script>
