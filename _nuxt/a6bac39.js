(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{910:function(e,t,r){"use strict";r.r(t);r(6),r(5),r(3),r(2),r(7),r(4),r(8);var o=r(0),n=(r(28),r(58));function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var y={props:{selectedCategory:{type:String,required:!0}},data:function(){return{uiText:{tableFields:[{key:"column"},{key:"description"}]}}},computed:l(l(l({},Object(n.c)(["getColumnNames","getColumnDescription"])),Object(n.e)(["colorInfo","columnToCategoryMap"])),{},{tableRows:function(){var e=this;return this.getColumnNames.map((function(t){return{category:e.columnToCategoryMap[t],column:t,description:e.getColumnDescription(t)}}))}}),methods:l(l({},Object(n.d)(["alterColumnCategoryMapping"])),{},{applyCategory:function(e,t,r){this.alterColumnCategoryMapping({category:this.selectedCategory,columnName:e.column})},styleTableRow:function(e,t){var r=this.columnToCategoryMap[e.column];return null===r?"":this.colorInfo.categoryClasses[r]}})},d=r(93),component=Object(d.a)(y,(function(){var e=this,t=e._self._c;return t("b-container",{attrs:{fluid:""}},[t("b-table",{attrs:{bordered:"",outlined:"","data-cy":"column-linking-table-table","head-variant":"dark",fields:e.uiText.tableFields,items:e.tableRows,"tbody-tr-class":e.styleTableRow},on:{"row-clicked":e.applyCategory}})],1)}),[],!1,null,null,null);t.default=component.exports}}]);