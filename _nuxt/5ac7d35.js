(window.webpackJsonp=window.webpackJsonp||[]).push([[15,10,12],{943:function(e,t,r){"use strict";r.r(t);r(15),r(14),r(11),r(9),r(16),r(12),r(17);var o=r(3),n=(r(43),r(77));function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){Object(o.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var y={name:"CategorySelectTable",props:{selectedCategory:{type:String,required:!0}},computed:l(l(l({},Object(n.c)(["getCategoryNames"])),Object(n.e)(["colorInfo"])),{},{categoryTable:function(){return this.getCategoryNames.map((function(e){return{category:e}}))}}),methods:{selectCategory:function(e){0!==e.length&&this.$emit("category-select",{category:e[0].category})},styleTableRow:function(e,t){return[this.selectedCategory!==e.category?"category-transparent":"category-opaque",this.colorInfo.categoryClasses[e.category]]}}},f=r(114),component=Object(f.a)(y,(function(){var e=this,t=e._self._c;return t("div",[t("b-row",[t("b-col",{attrs:{cols:"12"}},[t("b-table",{attrs:{outlined:"",selectable:"","head-variant":"dark",items:e.categoryTable,"select-mode":"single","selected-variant":"","tbody-tr-class":e.styleTableRow,"thead-class":"hidden"},on:{"row-selected":e.selectCategory}})],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports},944:function(e,t,r){"use strict";r.r(t);r(15),r(14),r(11),r(9),r(16),r(12),r(17);var o=r(3),n=(r(43),r(77));function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){Object(o.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var y={props:{selectedCategory:{type:String,required:!0}},data:function(){return{uiText:{tableFields:[{key:"column"},{key:"description"}]}}},computed:l(l(l({},Object(n.c)(["getColumnNames","getColumnDescription"])),Object(n.e)(["colorInfo","columnToCategoryMap"])),{},{tableRows:function(){var e=this;return this.getColumnNames.map((function(t){return{category:e.columnToCategoryMap[t],column:t,description:e.getColumnDescription(t)}}))}}),methods:l(l({},Object(n.d)(["alterColumnCategoryMapping"])),{},{applyCategory:function(e,t,r){this.alterColumnCategoryMapping({category:this.selectedCategory,columnName:e.column})},styleTableRow:function(e,t){var r=this.columnToCategoryMap[e.column];return null===r?"":this.colorInfo.categoryClasses[r]}})},f=r(114),component=Object(f.a)(y,(function(){var e=this,t=e._self._c;return t("b-container",{attrs:{fluid:""}},[t("b-table",{attrs:{bordered:"",outlined:"","data-cy":"column-linking-table-table","head-variant":"dark",fields:e.uiText.tableFields,items:e.tableRows,"tbody-tr-class":e.styleTableRow},on:{"row-clicked":e.applyCategory}})],1)}),[],!1,null,null,null);t.default=component.exports},953:function(e,t,r){"use strict";r.r(t);r(15),r(14),r(11),r(9),r(16),r(12),r(17);var o=r(3),n=r(77);function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}var l={name:"CategorizationPage",data:function(){return{selectedCategory:"",uiText:{categorySelectInstructions:"Click category and then corresponding column from tsv file",categorySelectTitle:"Recommended Categories"}}},computed:function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){Object(o.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},Object(n.c)(["getCategoryNames"])),mounted:function(){this.setSelectedCategory(this.getCategoryNames[0])},methods:{setSelectedCategory:function(e){this.selectedCategory=e}}},y=l,f=r(114),component=Object(f.a)(y,(function(){var e=this,t=e._self._c;return t("b-container",{attrs:{fluid:""}},[t("b-row",[t("b-col",{attrs:{cols:"4"}},[t("b-row",[t("h3",[e._v(e._s(e.uiText.categorySelectTitle))])]),e._v(" "),t("b-row",[t("p",{staticClass:"instructions-text"},[e._v("\n                    "+e._s(e.uiText.categorySelectInstructions)+"\n                ")])]),e._v(" "),t("category-select-table",{attrs:{"data-cy":"categorization-table","selected-category":e.selectedCategory},on:{"category-select":function(t){return e.setSelectedCategory(t.category)}}})],1),e._v(" "),t("b-col",{attrs:{cols:"8"}},[t("column-linking-table",{attrs:{"data-cy":"column-linking-table","selected-category":e.selectedCategory}})],1)],1),e._v(" "),t("categoryToolgroup")],1)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{CategorySelectTable:r(943).default,ColumnLinkingTable:r(944).default})}}]);