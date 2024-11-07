"use strict";var e=require("path"),t=require("fs");class s{constructor(e,t,s){this.loader=e,this.resolver=t,this.merger=s}async assemble(t){const s=await this.resolver.resolveIncludes(t,!0,e.dirname(t));return this.merger.mergeProperties(s)}}class r{constructor(){this.schemaAttributes={}}extractSchemaAttributes(e){const t=e.match(/<xs:schema([^>]*)>/i);if(t){const e=t[1].trim().split(/\s+/);for(const t of e){const[e,s]=t.split("=");e&&s&&!this.schemaAttributes[e]&&(this.schemaAttributes[e]=s)}}}mergeSchemaAttributes(e){const t=e.match(/<xs:schema([^>]*)>/i);if(t){const e=t[1].trim().split(/\s+/);for(const t of e){const[e,s]=t.split("=");e&&s&&!this.schemaAttributes[e]&&(this.schemaAttributes[e]=s)}}}getSchemaAttributes(){return this.schemaAttributes}async load(e,s){return new Promise(((r,i)=>{t.readFile(e,"utf8",((e,t)=>{if(e)return i(e);s?this.extractSchemaAttributes(t):this.mergeSchemaAttributes(t),s||(t=t.replace(/<\?xml.*?\?>\s*/i,"")),s||(t=t.replace(/<xs:schema[^>]*>/i,"").replace(/<\/xs:schema>/i,"")),r(t)}))}))}}class i{constructor(e){this.loader=e}applySchemaAttributes(e){const t=this.loader.getSchemaAttributes(),s=e.match(/<xs:schema[^>]*>/i);if(s){const r=`<xs:schema ${Object.entries(t).map((([e,t])=>`${e}=${t}`)).join(" ")}>`;return e.replace(s[0],r)}return e}async resolveIncludes(t,s=!0,r="."){let i=await this.loader.load(t,s);const c=/<xs:include\s+schemaLocation="([^"]+)"\s*\/?>/g;let a;for(;null!==(a=c.exec(i));){const t=e.resolve(r,a[1]),s=await this.resolveIncludes(t,!1,r);i=i.replace(a[0],s)}return s?this.applySchemaAttributes(i):i}}class c{constructor(e){this.strategy=e}mergeProperties(e){return e}}class a{merge(e,t){return`${t}`}}const o=new class{constructor(){this.loader=new r,this.resolver=new i(this.loader),this.setMergeStrategy(new a)}setMergeStrategy(e){return this.merger=new c(e),this}assemble(e){if(!this.merger)throw new Error("Merge strategy must be set before building XSDAssembler.");return new s(this.loader,this.resolver,this.merger).assemble(e)}};module.exports=o;//# sourceMappingURL=index.js.map
