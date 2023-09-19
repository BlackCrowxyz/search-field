<template>
  <div class="py-10">
    <UiCard>

      <template v-for="(parent, i) in formData" :key="parent.name + '-' + i">

        <UiCard>
          <component v-if="parent?.sub" :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: formData[i].value }"
            @update:modelValue="e => onChange(e, parent.name, parent.type)">

            <UiCard :border="true">
              <component v-for="(child, j) in parent.sub" :key="i + '-' + j" :is="getComponent(child.type)"
                v-bind="{ parent: child, modelValue: formData[i].sub[j].value }"
                @update:modelValue="e => onChange(e, child.name, child.type)">
              </component>
            </UiCard>

          </component>

          <component v-else-if="!parent?.parent" :is="getComponent(parent.type)"
            v-bind="{ parent: parent, modelValue: formData[i].value }"
            @update:modelValue="e => onChange(e, parent.name, parent.type)">
          </component>
        </UiCard>

        <div v-if="i+1 != formData.length && !parent?.parent" class="mt-4 border"></div>

        <!-- <UiBox v-if="!parent?.parent">
        <template v-if="parent.type == ('text') || parent.type == ('number') || parent.type == ('textarea')">
          <InputField :parent="parent" :modelValue="formData[i].value"
            @update:modelValue="e => onChange(e, parent.name, parent.type)" />
        </template>
        <template v-else-if="parent.type == ('dropdown')">
          <InputDropdown :parent="parent" :modelValue="formData[i].value"
            @update:modelValue="e => onChange(e, parent.name, parent.type)" />
        </template>
        <template v-else-if="parent.type == ('checkbox')">
          <InputCheckbox :parent="parent" :value="parent.value" :modelValue="formData[i].value"
            @update:modelValue="e => onChange(e, parent.name, parent.type)" />
        </template>
        <template v-else-if="parent.type == ('checkbox-group')">
          <InputCheckboxGroup :parent="parent" :modelValue="formData[i].value" @update:modelValue="e => modelValue = e"
            @changed="e => onChange(e, parent.name, parent.type)" />
        </template>
        <template v-else>Unknown component</template>
      </UiBox>
      <UiBox v-if="parent?.children?.length" inside>
        <template v-for="(child, j) in parent.sub" :key="i + '-' + j">
          <template v-if="child.type == ('text') || child.type == ('number') || child.type == ('textarea')">
            <InputField :parent="child" :modelValue="formData[i].value"
              @update:modelValue="e => onChange(e, child.name, child.type)" />

          </template>
          <template v-else-if="child.type == ('dropdown')">
            <InputDropdown :parent="child" :modelValue="formData[i].value"
              @update:modelValue="e => onChange(e, child.name, child.type)" />
          </template>
          <template v-else-if="child.type == ('checkbox')">
            <InputCheckbox :parent="child" :value="child.value" :modelValue="formData[i].value"
              @update:modelValue="e => onChange(e, child.name, child.type)" />
          </template>
          <template v-else-if="child.type == ('checkbox-group')">
            <InputCheckboxGroup :parent="child" :modelValue="formData[i].value" @update:modelValue="e => modelValue = e"
              @changed="e => onChange(e, child.name, child.type)" />
          </template>
          <template v-else>Unknown component</template>
        </template>
      </UiBox> -->
      </template>
    </UiCard>

  </div>


  {{ filterState }}
  <br><br>
  <UiFilters>
    <template v-for="(value, name) in filterState">
      <UiBadge @click="onClear(name)">
        {{ name }}: ({{ value.toString() }})
      </UiBadge>
    </template>
  </UiFilters>
</template>

<script setup>
// todo: for clean code just ask about components
import InputField from './components/input/field.vue';
import InputDropdown from './components/input/dropdown.vue';
import InputCheckbox from './components/input/checkbox.vue';
import InputCheckboxGroup from './components/input/checkbox-group.vue';

const getComponent = (cType) => {
  switch (cType) {
    case 'text':
    case 'number':
    case 'textarea':
      return InputField
    case 'dropdown':
      return InputDropdown
    case 'checkbox':
    case 'checkbox-group':
      return InputCheckbox
    // return InputCheckboxGroup
  }
}

const test2 = (e) => {
  console.log('change', e,)
}

const formData = ref([
  // {
  //   "type": "text" | "number" | "dropdown" | "textarea" | "checkbox" | "checkbox-group",
  //   "name": string,
  //   "label": string,
  //   "children"?: string[],
  //   "parent"?: string,
  //   "options": [{ value: string | number, title: string | number }],
  // },
  {
    "type": "text",
    "name": "c2",
    "label": "کالا دو",
    // "children": ["1","2"],
    "parent": "parent",
    // "options": [{ value: string | number, title: string | number }],
  },
  {
    "type": "number",
    "name": "c1",
    "label": "کالا یک",
    // "children": ["1","2"],
    "parent": "parent",
    // "options": [{ value: string | number, title: string | number }],
  },
  {
    "type": "number",
    "name": "parent",
    "label": "نام کالا",
    "children": ["c1", "c2"],
    // "parent"?: string,
    // "options": [{ value: string | number, title: string | number }],
  },
  // {
  //   "type": "number",
  //   "name": "number1",
  //   "label": "عددی",
  //   // "children": ["1","2"],
  //   // "parent"?: string,
  //   // "options": [{ value: string | number, title: string | number }],
  // },
  // {
  //   "type": "textarea",
  //   "name": "textarea1",
  //   "label": "textarea",
  //   // "children": ["1","2"],
  //   // "parent"?: string,
  //   // "options": [{ value: string | number, title: string | number }],
  // },
  // {
  //   "type": "dropdown",
  //   "name": "dropdown1",
  //   "label": "دراپ دون",
  //   // "children": ["1","2"],
  //   // "parent"?: string,
  //   "options": [{ value: 1, title: 123 }, { value: 2, title: 2234234 }, { value: 3, title: 3546457 }],
  // },
  // {
  //   "type": "checkbox",
  //   "name": "checkbox1",
  //   "label": "checkbox1",
  //   // "children": ["1","2"],
  //   // "parent"?: string,
  //   // "options": [{ value: string | number, title: string | number }],
  // },
  {
    "type": "checkbox-group",
    "name": "checkbox-group",
    "label": "checkbox-group",
    // "children": ["1","2"],
    // "parent"?: string,
    "options": [{ value: '1', title: 'اولین' }, { value: '2', title: 'دومین' }],
    "value": []
  },
])

const router = useRouter()
const route = useRoute()
const filterState = ref({})

function setFilterState(filterState) {
  // TODO: set route text and update fileterState
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

  //TODO: remove + from last part
  // query = query.slice(0, -1)
  console.log(filterState)
  // console.log((JSON.stringify(query)))
  // console.log(JSON.parse(JSON.stringify(query)))


  router.push({
    path: '/',
    query: filterState
  })
}

function onChange(e, name, type) {
  // console.log("onChange(e, name, type)", { e }, { name }, { type })
  if (e) filterState.value[name] = e
  else delete filterState.value[name]

  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x]
    if (name == item.name) {
      const v = e?.target ? e.target.value : e
      formData.value[x] = { ...item, value: v }
      break
    }
  }

  setFilterState(filterState.value)
}

function clearItems(name = 'all') {
  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x]
    if (name == 'all') {
      formData.value[x].value = item.type == 'checkbox-group' ? [] : null;
    }
    else {
      if (name == item.name) {
        formData.value[x].value = item.type == 'checkbox-group' ? [] : null;
        break
      }
    }
  }
}

function onClear(name) {
  delete filterState.value[name]
  clearItems(name)
  setFilterState(filterState.value)
}

function onClearAll() {
  filterState.value = []
  clearItems()
  setFilterState(filterState.value)
}

function mapObject() {
  console.log(route.query)

  if (Object.keys(route.query).length != 0) {
    filterState.value = route.query
    console.log('******', route.query)
    // TODO : there is a bug when reloading the page
    router.push({
      path: '/',
      query: null
    })
  }

  for (let x = 0; x < formData.value.length; x++) {
    const item = formData.value[x]
    item.value = null
    if (item.name in filterState.value) {
      let v = filterState.value[item.name]
      if (v == 'true') v = true
      else if (v == 'false') v = false
      item.value = v
    }

    if (item?.children || item?.parent) { // item is parent
      if (item?.children) {
        formData.value[x] = { ...item, sub: [] } // pushing parent
        for (let i = 0; i < item.children.length; i++) {
          const childName = item.children[i];
          for (let j = 0; j < formData.value.length; j++) {
            const data = formData.value[j];
            if (childName == data.name) {
              // if (childName in filterState.value)
              //   item.value = filterState.value[childName]
              formData.value[x].sub.push(data)
            }
          }
        }
      }
    } else if (item.type == 'checkbox-group') {
      if (!item.value?.length)
        item.value = []
      formData.value[x] = item
    }
  }

  console.log(formData.value)
}

mapObject()
</script>
