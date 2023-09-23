export default [
    {
        "type": "text",
        "name": "c2",
        "label": "کالا دو",
        "parent": "parent",
    },
    {
        "type": "number",
        "name": "c1",
        "label": "کالا یک",
        "parent": "parent",
    },
    {
        "type": "number",
        "name": "parent",
        "label": "نام کالا",
        "children": ["c1", "c2"],
    },

    {
        "type": "number",
        "name": "number1",
        "label": "وزن کالاها",
    },
    {
        "type": "textarea",
        "name": "textarea1",
        "label": "توضیحات",
    },
    {
        "type": "checkbox",
        "name": "checkbox2",
        "label": "ارسال فوری",
    },
    {
        "type": "dropdown",
        "name": "dropdown1",
        "label": "انتخاب تعداد کالا",
        "options": [{ value: 1, title: 100 }, { value: 2, title: 200 }, { value: 3, title: 300 }],
    },
    // {
    //     "type": "checkbox",
    //     "name": "checkbox1",
    //     "label": "ارسال فوری",
    //     "children": ["checkbox-group"],
    // },
    {
        "type": "checkbox-group",
        "name": "checkbox-group",
        "label": "روزهای کاری را انتخاب کنید",
        "options": [{ value: '1', title: 'شنبه' }, { value: '2', title: 'یکشنبه' }, { value: '3', title: 'دوشنبه' }, { value: '4', title: 'سه شنبه' }],
    }
]