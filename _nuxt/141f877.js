(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{378:function(o,t,e){var content=e(389);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[o.i,content,""]]),content.locals&&(o.exports=content.locals);(0,e(67).default)("016425ea",content,!0,{sourceMap:!1})},388:function(o,t,e){"use strict";e(378)},389:function(o,t,e){var r=e(66)((function(i){return i[1]}));r.push([o.i,".no-padding-right{padding-right:0}",""]),r.locals={},o.exports=r},399:function(o,t,e){"use strict";e.r(t);e(5),e(4),e(2),e(1),e(6),e(3),e(7),e(19),e(64),e(48),e(11),e(65),e(76),e(54);var r=e(0),n=(e(60),e(77),e(16),e(268),e(22),e(144),e(68));function l(o,t){var e="undefined"!=typeof Symbol&&o[Symbol.iterator]||o["@@iterator"];if(!e){if(Array.isArray(o)||(e=function(o,t){if(!o)return;if("string"==typeof o)return c(o,t);var e=Object.prototype.toString.call(o).slice(8,-1);"Object"===e&&o.constructor&&(e=o.constructor.name);if("Map"===e||"Set"===e)return Array.from(o);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return c(o,t)}(o))||t&&o&&"number"==typeof o.length){e&&(o=e);var i=0,r=function(){};return{s:r,n:function(){return i>=o.length?{done:!0}:{done:!1,value:o[i++]}},e:function(o){throw o},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,l=!0,m=!1;return{s:function(){e=e.call(o)},n:function(){var o=e.next();return l=o.done,o},e:function(o){m=!0,n=o},f:function(){try{l||null==e.return||e.return()}finally{if(m)throw n}}}}function c(o,t){(null==t||t>o.length)&&(t=o.length);for(var i=0,e=new Array(t);i<t;i++)e[i]=o[i];return e}function m(object,o){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(object);o&&(e=e.filter((function(o){return Object.getOwnPropertyDescriptor(object,o).enumerable}))),t.push.apply(t,e)}return t}function d(o){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?m(Object(source),!0).forEach((function(t){Object(r.a)(o,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(o,Object.getOwnPropertyDescriptors(source)):m(Object(source)).forEach((function(t){Object.defineProperty(o,t,Object.getOwnPropertyDescriptor(source,t))}))}return o}var h={props:{columnNames:{type:Array,required:!0}},inject:["columnToCategoryMap","toolGroups"],data:function(){return{assessmentToolGroups:{items:[],fields:[{key:"name",label:"Group Name",type:"text",placeholder:"Enter Name..."},{key:"toolList",label:"Tools",type:"text"},{key:"action",label:" ",type:"text"}]},currentGroup:"",currentMode:"create",modes:{create:"create",modify:"modify"},newToolGroupName:"",selectedTools:[],uiText:{alreadyExistsText:"Group already exists in table",createToolGroupButton:"+ Create Tool Group",instructions:"Enter a name, choose columns, and then click the 'create' button",modifyToolGroupbutton:"~ Modify Tool Group",removeToolGroupButton:"x Remove Tool Group",title:"Assessment Tool Groups",toolGroupNamePlaceholder:"Type name of assessment tool group here..."}}},computed:d(d({},Object(n.b)(["getGroupOfTool","isToolGrouped"])),{},{hasNoGroups:function(){return 0===this.assessmentToolGroups.items.length},invalidNameEntered:function(){var o=this.newToolGroupName in this.toolGroups;return this.modes.modify===this.currentMode&&(o=o&&this.currentGroup!==this.newToolGroupName),o},readyToAddOrModifyToolGroup:function(){var o=""!==this.newToolGroupName&&this.selectedTools.length>0;if(!o)return!1;switch(this.currentMode){case this.modes.create:o=o&&!Object.hasOwn(this.toolGroups,this.newToolGroupName);break;case this.modes.modify:for(var t in this.toolGroups)if(t===this.newToolGroupName&&t!==this.currentGroup){o=!1;break}}return o}}),watch:{columnToCategoryMap:{deep:!0,handler:function(o,t){var e,r=[],n=l(this.assessmentToolGroups.items);try{for(n.s();!(e=n.n()).done;){var c,m=l(e.value.toolList.split(", "));try{for(m.s();!(c=m.n()).done;){var d=c.value;null===this.columnToCategoryMap[d]&&r.push(d)}}catch(o){m.e(o)}finally{m.f()}}}catch(o){n.e(o)}finally{n.f()}for(var h in this.toolGroups){var f,T=l(r);try{for(T.s();!(f=T.n()).done;){var G=f.value;this.toolGroups[h].includes(G)&&this.$emit("remove-tool-from-group",{tool:G,group:h})}}catch(o){T.e(o)}finally{T.f()}}for(var y in this.toolGroups)0===this.toolGroups[y].length&&this.removeToolGroup({item:{name:y}});this.refreshToolGroupTable()}}},mounted:function(){this.refreshToolGroupTable()},methods:{columnOptions:function(){var o=[];for(var t in this.columnToCategoryMap)if("Assessment Tool"==this.columnToCategoryMap[t]){var e=!0;(this.modes.modify===this.currentMode&&this.currentGroup===this.getGroupOfTool(t)||!this.isToolGrouped(t))&&(e=!1),o.push({disabled:e,text:t,value:t})}return o},currentModeText:function(){return this.modes.create===this.currentMode?this.uiText.createToolGroupButton:this.uiText.modifyToolGroupbutton},createToolGroup:function(){this.assessmentToolGroups.items.push({name:this.newToolGroupName,toolList:this.selectedTools.join(", ")}),this.$emit("tool-group-action",{action:"createToolGroup",data:{name:this.newToolGroupName,tools:this.selectedTools}}),this.switchMode(this.modes.create,{})},modifyToolGroup:function(){var o=this,t=this.assessmentToolGroups.items.findIndex((function(t){return o.currentGroup===t.name}));this.$set(this.assessmentToolGroups.items[t],"name",this.newToolGroupName),this.$set(this.assessmentToolGroups.items[t],"toolList",this.selectedTools.join(", ")),this.$emit("tool-group-action",{action:"modifyToolGroup",data:{name:this.newToolGroupName,previousName:this.currentGroup,tools:this.selectedTools}}),this.switchMode(this.modes.create,{}),this.$refs.table.clearSelected()},refreshToolGroupTable:function(){for(var o in this.assessmentToolGroups.items=[],this.toolGroups)this.assessmentToolGroups.items.push({name:o,toolList:this.toolGroups[o].join(", ")})},removeToolGroup:function(o){var t=this.assessmentToolGroups.items.findIndex((function(t){return t.name===o.item.name}));this.assessmentToolGroups.items.splice(t,1),this.$emit("tool-group-action",{action:"removeToolGroup",data:{name:o.item.name}})},switchMode:function(o,t){this.modes.create===o?(this.newToolGroupName="",this.selectedTools=[],this.currentMode=this.modes.create,this.currentGroup=""):this.modes.modify===o&&(this.currentMode=this.modes.modify,this.currentGroup=t.name,this.newToolGroupName=t.name)},selectTableRow:function(o){0===o.length?this.switchMode(this.modes.create,{}):this.switchMode(this.modes.modify,o[0])}}},f=(e(388),e(59)),component=Object(f.a)(h,(function(){var o=this,t=o._self._c;return t("b-row",{staticStyle:{"margin-bottom":"0"}},[t("b-col",{attrs:{cols:"6"}},[t("b-row",[t("h3",[o._v(o._s(o.uiText.title))])]),o._v(" "),t("b-row",[t("p",{staticClass:"instructions-text"},[o._v("\n                "+o._s(o.uiText.instructions)+"\n            ")])]),o._v(" "),t("b-row",[t("b-input-group",[t("label",{attrs:{for:"tool-name-textbox"}},[o._v("Group name: ")]),o._v(" "),t("b-form-input",{attrs:{"data-cy":"toolgroup-name-textbox",id:"tool-name-textbox",placeholder:o.uiText.toolGroupNamePlaceholder},model:{value:o.newToolGroupName,callback:function(t){o.newToolGroupName=t},expression:"newToolGroupName"}})],1)],1),o._v(" "),t("b-row",[t("b-input-group",[t("label",{attrs:{for:"column-multiselect"}},[o._v("Columns: ")]),o._v(" "),t("b-form-select",{attrs:{"data-cy":"toolgroup-column-multiselect",id:"column-multiselect",multiple:"",options:o.columnOptions(),"select-size":4},model:{value:o.selectedTools,callback:function(t){o.selectedTools=t},expression:"selectedTools"}})],1)],1),o._v(" "),t("b-row",[t("b-col",{attrs:{cols:"4"}},[o.invalidNameEntered?t("p",{staticClass:"instructions-text"},[o._v("\n                    "+o._s(o.uiText.alreadyExistsText)+"\n                ")]):o._e()]),o._v(" "),t("b-col",{staticClass:"no-padding-right",attrs:{ols:"8"}},[t("b-button",{staticClass:"float-right",attrs:{"data-cy":"create-toolgroup-button",disabled:!o.readyToAddOrModifyToolGroup,variant:"info"},on:{click:function(t){o.modes.create===o.currentMode?o.createToolGroup():o.modifyToolGroup()}}},[o._v("\n                    "+o._s(o.currentModeText())+"\n                ")])],1)],1)],1),o._v(" "),t("b-col",{attrs:{cols:"6"}},[t("b-row",[t("b-table",{ref:"table",attrs:{"data-cy":"toolgroup-table",bordered:"",selectable:"","head-variant":"dark","select-mode":"single",items:o.assessmentToolGroups.items,fields:o.assessmentToolGroups.fields},on:{"row-selected":function(t){return o.selectTableRow(t)}},scopedSlots:o._u([o.hasNoGroups?{key:"top-row",fn:function(){return o._l(o.assessmentToolGroups.fields,(function(e){return t("td",{key:e.key},[o._v("\n                             \n                    ")])}))},proxy:!0}:null,{key:"cell(action)",fn:function(e){return[t("b-button",{staticClass:"float-right",attrs:{variant:"danger"},on:{click:function(t){return o.removeToolGroup(e)}}},[o._v("\n                        "+o._s(o.uiText.removeToolGroupButton)+"\n                    ")])]}}],null,!0)})],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports}}]);